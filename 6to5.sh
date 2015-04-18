while inotifywait -r -e close_write src; do babel --modules amd src --out-dir app; done
