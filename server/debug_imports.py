import traceback, sys
modules = [
    'services.verification_service',
    'services.generation_service',
    'services.plagiarism_service',
    'services.humanize_service',
    'services.typing_service',
    'utils.processors',
]
for m in modules:
    try:
        __import__(m)
        print(m, 'imported successfully')
    except Exception as e:
        print(m, 'failed to import:', e)
        traceback.print_exc()
