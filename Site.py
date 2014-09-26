from flask import Flask

app = Flask(__name__, static_folder='.')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def serve_path(path):
    return app.send_static_file(path)


if __name__ == '__main__':
    app.run()
