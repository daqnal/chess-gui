import javascript

def main(module):
    assert module.x == 1

javascript.import_modules(['./js_test.js'], main)