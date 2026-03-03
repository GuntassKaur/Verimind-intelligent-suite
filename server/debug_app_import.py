import traceback
try:
    import app
    print('App imported successfully')
except Exception as e:
    print('Import error:', e)
    traceback.print_exc()
