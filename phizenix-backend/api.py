from flask import Flask 
from flask_sqlalchemy import SQLAlchemy  
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)
CORS(app) 

class UserModel(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    
    def __repr__(self):
        data = {
            "username": self.username,
            "email": self.email,
            "password": self.password
        }
        return data

user_args = reqparse.RequestParser()
user_args.add_argument('username', type=str, required=True, help="username cannot be blank")
user_args.add_argument('email', type=str, required=True, help="email cannot be blank")
user_args.add_argument('password', type=str, required=True, help="password cannot be blank")

login_and_reset_user_args = reqparse.RequestParser()
login_and_reset_user_args.add_argument('username', type=str, required=True, help="username cannot be blank")
login_and_reset_user_args.add_argument('password', type=str, required=True, help="password cannot be blank")

update_user_args = reqparse.RequestParser()
update_user_args.add_argument('newPassword', type=str, required=True, help="password cannot be blank")

userRegistrationFields = {
    'username': fields.String,
    'email': fields.String,
    'password': fields.String
}

userFields = {
    'user_id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password': fields.String
}

class RegisterUser(Resource):
    @marshal_with(userRegistrationFields)
    def post(self):
        args = user_args.parse_args()
        
        existing_user = UserModel.query.filter((UserModel.username == args["username"]) | (UserModel.email == args["email"])).first()

        if existing_user:
            abort(409, message="User with this username or email already exists.")
            
        if (args["username"] and args["email"] and args["password"]):
            user = UserModel(username=args["username"], email=args["email"], password=args["password"])
            try:
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                return e, 500
            return user, 201
        else:
            abort(400, message="Username, Email, Password Should not be null.")    

class LoginUser(Resource):
    def post(self):
        args = login_and_reset_user_args.parse_args()
        username = args.get("username")
        password = args.get("password")

        user = UserModel.query.filter_by(username=username).first()

        if not user or user.password != password:
            abort(401, message="Invalid username or password")

        return {"result": "success","username": user.username}, 200

class User(Resource):
    @marshal_with(userFields)
    def get(self, user_id=None):
        if user_id:
            user = UserModel.query.filter_by(user_id=user_id).first()
            if not user:
                abort(404, message="User not found")
            return user, 200
        else:
            users = UserModel.query.all()
            return users, 200
    
    def put(self, user_id):
        user = UserModel.query.get(user_id)
        
        if not user:
            abort(404, message="User not Found")
        try:
            args = update_user_args.parse_args()     
            user.password = args.get("newPassword")

            db.session.commit()
            return {"result": "success"}, 200
        except Exception as e:
            abort(400, message=f"Failed to reset the Password, {e}")

    def delete(self, user_id):
        user = UserModel.query.get(user_id)
        if not user:
            abort(404, message="User not Found")
        try:
            db.session.delete(user)
            db.session.commit()
            return {"result": "success"}, 200
        except Exception as e:
            return {"result": "failed"}, 500
        
api.add_resource(RegisterUser, '/api/register/')
api.add_resource(LoginUser, '/api/login/')
api.add_resource(User, '/api/user/', '/api/user/<int:user_id>')


@app.route('/')
def home():
    return 'API call working...', 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug = True)