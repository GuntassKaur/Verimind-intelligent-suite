import importlib, traceback, sys
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
        importlib.import_module(m)
        print(m, 'OK')
    except Exception as e:
        print(m, 'ERROR', e)
        traceback.print_exc()
