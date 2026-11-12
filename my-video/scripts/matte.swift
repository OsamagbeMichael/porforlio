// npm run matte -- <slug>
// Cuts the speaker out of public/reels/<slug>/raw.mp4 on this Mac (Apple Vision, nothing uploaded) for reel.json `behind`.
// Output: public/reels/<slug>/matte.webm, the raw take with everything but the person transparent.
// Why WebM VP9 alpha: Chrome and @remotion/media both decode it, so preview and render use the same <Video> as the raw take.
import AVFoundation
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 2 else { print("usage: npm run matte -- <slug>"); exit(1) }
let dir = "public/reels/\(args[1])"
let rawURL = URL(fileURLWithPath: "\(dir)/raw.mp4")
let maskURL = URL(fileURLWithPath: NSTemporaryDirectory() + "matte-\(args[1])-mask.mov")
let outPath = "\(dir)/matte.webm"

let asset = AVURLAsset(url: rawURL)
guard let track = try await asset.loadTracks(withMediaType: .video).first else { print("no video in \(rawURL.path)"); exit(1) }
let size = try await track.load(.naturalSize)
let transform = try await track.load(.preferredTransform)
guard transform.isIdentity else { print("raw.mp4 is rotated; export it upright first"); exit(1) } // shortcut: no rotation support, add it if a phone take ever needs it

// Read decoded frames; write a grayscale mask (white = person) with the SAME timestamps, so it stays in sync with a variable-frame-rate take.
let reader = try AVAssetReader(asset: asset)
let output = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(output)
try? FileManager.default.removeItem(at: maskURL)
let writer = try AVAssetWriter(outputURL: maskURL, fileType: .mov)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.proRes422, // near-lossless, so mask edges stay sharp until the final encode
  AVVideoWidthKey: size.width, AVVideoHeightKey: size.height,
])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: size.width, kCVPixelBufferHeightKey as String: size.height,
])
writer.add(input)
reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
let ctx = CIContext()
var count = 0
while let sample = output.copyNextSampleBuffer(), let frame = CMSampleBufferGetImageBuffer(sample) {
  try VNImageRequestHandler(cvPixelBuffer: frame).perform([request])
  guard let mask = request.results?.first?.pixelBuffer else { continue }
  // Vision's mask is smaller than the frame; stretch it back over the whole frame.
  let small = CIImage(cvPixelBuffer: mask)
  let scaled = small.transformed(by: CGAffineTransform(scaleX: size.width / small.extent.width, y: size.height / small.extent.height))
  guard let pool = adaptor.pixelBufferPool else { print("writer failed: \(writer.error?.localizedDescription ?? "?")"); exit(1) }
  var buffer: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
  ctx.render(scaled, to: buffer!)
  while !input.isReadyForMoreMediaData { usleep(1000) }
  adaptor.append(buffer!, withPresentationTime: CMSampleBufferGetPresentationTimeStamp(sample))
  count += 1
  if count % 100 == 0 { print("\(count) frames") }
}
guard reader.status == .completed else { print("read failed: \(reader.error?.localizedDescription ?? "?")"); exit(1) }
input.markAsFinished()
await writer.finishWriting()
guard writer.status == .completed else { print("write failed: \(writer.error?.localizedDescription ?? "?")"); exit(1) }

// Join raw colour + mask alpha into a VP9 WebM; passthrough keeps every original timestamp.
let ffmpeg = Process()
ffmpeg.executableURL = URL(fileURLWithPath: "/usr/bin/env")
ffmpeg.arguments = [
  "ffmpeg", "-y", "-loglevel", "error", "-i", rawURL.path, "-i", maskURL.path,
  "-filter_complex", "[1:v]scale=in_range=limited:out_range=full,format=gray[a];[0:v][a]alphamerge,format=yuva420p",
  "-fps_mode", "passthrough", "-an", "-c:v", "libvpx-vp9", "-crf", "18", "-b:v", "0", "-auto-alt-ref", "0", outPath,
]
try ffmpeg.run()
ffmpeg.waitUntilExit()
try? FileManager.default.removeItem(at: maskURL)
guard ffmpeg.terminationStatus == 0 else { print("ffmpeg failed (brew install ffmpeg?)"); exit(1) }
print("\(count) frames -> \(outPath)")
