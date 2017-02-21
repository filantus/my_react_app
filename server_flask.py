from flask import Flask, request, send_from_directory, render_template
import os

app = Flask(__name__, static_url_path='', template_folder='./')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    if os.path.exists('./static/%s' % path):
        return send_from_directory('./static/', path)
    print('File not found: /static/%s' % path)
    return ''

@app.route('/app.js')
def send_app():
    return send_from_directory('./', 'app.js')

@app.route('/files')
def send_files_data():
    try:
        from modules.getfiles import get_dir_files_data
        return get_dir_files_data()
    except:
        return send_from_directory('./', 'data.cache')

if __name__ == "__main__":
    app.run(port=8080, threaded=True)
