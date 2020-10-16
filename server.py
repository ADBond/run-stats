from flask import (
    Flask, send_file, send_from_directory
)


def make_app():
  app = Flask(__name__)
  print("App successfully created")

  @app.route("/")
  def live_page_version():
    return send_file("index.html")

  @app.route("/runs.csv")
  def get_data():
    return send_from_directory(
      "./",
      "runs.csv",
      mimetype='text/csv',
    )

  # TODO: should probably put stuff in folders etc
  @app.route("/summarise.js")
  def js():
    return send_file("summarise.js")
  @app.route("/style.css")
  def style_sheet():
    return send_file("style.css")

  return app
