from flask import Flask
from flask_cors import CORS
from strawberry.flask.views import GraphQLView

from schema import schema

app = Flask(__name__)
CORS(app)


app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.route("/")
def home():
    return "Welcome to the Loan Application API"


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5231)
