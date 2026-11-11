// npm run cutout -- <photo> <out.png>
// Cuts the main subject out of a photo, on this Mac (Apple Vision, nothing uploaded), for the text-behind style.
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else { print("usage: npm run cutout -- <photo> <out.png>"); exit(1) }
guard let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else { print("can't read \(args[1])"); exit(1) }

let handler = VNImageRequestHandler(ciImage: input)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first, !result.allInstances.isEmpty else { print("no subject found in \(args[1])"); exit(1) }

// Same size as the photo, so the cut-out lines up exactly when stacked on top of it.
let masked = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
try CIContext().writePNGRepresentation(
  of: CIImage(cvPixelBuffer: masked), to: URL(fileURLWithPath: args[2]),
  format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("subject -> \(args[2])")
