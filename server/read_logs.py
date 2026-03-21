import os

log_file = r'c:\Users\Guntass Kaur\Downloads\aiproject\server\server.log'
if os.path.exists(log_file):
    with open(log_file, 'rb') as f:
        content = f.read()
        try:
            # Try to decode from UTF-16LE which was the error before
            text = content.decode('utf-16le')
            print(text[-2000:])
        except:
            try:
                # Try UTF-8 as fallback
                text = content.decode('utf-8')
                print(text[-2000:])
            except Exception as e:
                print(f"Failed to decode: {e}")
else:
    print("Log file not found.")
