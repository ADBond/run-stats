from flask import (
    Flask, render_template, send_from_directory
)


def make_app():
  app = Flask(__name__)
  print("App successfully created")

  @app.route("/")
  def home_route():
    print("fetching the d3 page...")
    return "basic server"

  @app.route("/runs.csv")
  def get_data():
    print("Getting ratings data")
    return send_from_directory(
      "./",
      "runs.csv",
      mimetype='text/csv',
    )

  return app
