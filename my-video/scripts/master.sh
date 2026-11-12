# npm run master -- <slug>
# out/<slug>.mp4 -> out/<slug>-master.mp4: speech EQ, then loudness to -14 LUFS with peaks under -2 dB.
# Why these numbers: docs/editor-rules.md (audio). The video stream is copied, not re-encoded.
set -e
s=$1
[ -n "$s" ] || { echo "usage: npm run master -- <slug>"; exit 1; }
ffmpeg -v error -y -i "out/$s.mp4" -c:v copy \
  -af "highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2,loudnorm=I=-14:TP=-2.5:LRA=11" \
  -ar 48000 -c:a aac -b:a 192k "out/$s-master.mp4"
# Print the measured result so it can be checked against the targets.
ffmpeg -hide_banner -nostats -i "out/$s-master.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
echo "-> out/$s-master.mp4"
