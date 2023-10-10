#!/usr/bin/env python3
from flask import Flask, request, make_response, session
from flask_restful import Api, Resource
from marshmallow import validate, fields
from config import api, app, db, ma, bcrypt
from models import User, DreamLog, Tag, DreamTag
from dotenv import load_dotenv
import os

load_dotenv()
secret_key = os.environ.get('SECRET_KEY')
app.secret_key = secret_key


# Schemas paired with respective classes
class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    username = fields.Str(required=True, validate=validate.Length(min=4, max=30))
    password = fields.Str(
        load_only=True, required=True, validate=validate.Length(min=8)
    )


user_singular_schema = UserSchema()
user_plural_schema = UserSchema(many=True)


class Users(Resource):
    def get(self):
        users = User.query.all()
        response = make_response(user_plural_schema.dump(users), 200)
        return response

    class Users(Resource):
        def post(self):
            try:
                data = request.json
                user_data = user_singular_schema.load(data)

                hashed_password = bcrypt.generate_password_hash(
                    user_data.get("password", "")
                ).decode('utf-8')

                new_user = User(
                    username=user_data["username"],
                    password_hash=hashed_password,
                )
                db.session.add(new_user)
                db.session.commit()

                response = user_singular_schema.dump(new_user), 201
                return response
            except Exception:
                return {
                    "message": "Failed to create user, ensure a non duplicate username."
                }, 400


class UsersByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        response = make_response(user_singular_schema.dump(user), 200)
        return response

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        db.session.delete(user)
        db.session.commit()

        response = {"message": "user successfully deleted"}
        return response


class DreamLogSchema(ma.SQLAlchemySchema):
    class Meta:
        model = DreamLog

    id = ma.auto_field()
    title = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    text_content = fields.Str(required=True, validate=validate.Length(max=500))
    is_public = fields.Bool(required=True)
    rating = fields.Str(
        validate=validate.OneOf(["Good Dream", "Neutral Dream", "Bad Dream"])
    )

    published_at = ma.auto_field()
    edited_at = ma.auto_field()

    user = ma.Nested(user_singular_schema)


dream_log_singular_schema = DreamLogSchema()
dream_log_plural_schema = DreamLogSchema(many=True)


class DreamLogs(Resource):
    def get(self):
        dream_logs = DreamLog.query.all()
        response = make_response(dream_log_plural_schema.dump(dream_logs), 200)
        return response

    def post(self):
        if "user_id" not in session:
            return {"message": "You must be logged in to post a dream log"}, 401

        user_id = session["user_id"]

        data = request.json
        dream_log_data = dream_log_singular_schema.load(data)

        new_dream_log = DreamLog(
            title=dream_log_data["title"],
            text_content=dream_log_data["text_content"],
            is_public=dream_log_data["is_public"],
            rating=dream_log_data.get("rating", None),
            user_id=user_id,
        )
        db.session.add(new_dream_log)
        db.session.commit()

        response = make_response(dream_log_singular_schema.dump(new_dream_log), 201)
        return response


class DreamLogsByID(Resource):
    def get(self, id):
        dream_log = DreamLog.query.filter_by(id=id).first()
        response = make_response(dream_log_singular_schema.dump(dream_log), 200)
        return response

    def patch(self, id):
        dream_log = DreamLog.query.filter_by(id=id).first()

        for attr in request.form:
            setattr(dream_log, attr, request.form[attr])

        db.session.add(dream_log)
        db.session.commit()

        response = make_response(dream_log_singular_schema.dump(dream_log), 200)

        return response

    def delete(self, id):
        dream_log = DreamLog.query.filter_by(id=id).first()
        db.session.delete(dream_log)
        db.session.commit()

        return make_response({"message": "Dream log deleted successfully"})


class TagSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Tag

    id = ma.auto_field()
    name = fields.Str(required=True, validate=validate.Length(min=1, max=30))


tag_singular_schema = TagSchema()
tag_plural_schema = TagSchema(many=True)


class Tags(Resource):
    def get(self):
        tags = Tag.query.all()
        response = make_response(tag_plural_schema.dump(tags))
        return response


class DreamTagSchema(ma.SQLAlchemySchema):
    class Meta:
        model = DreamTag

    id = ma.auto_field()
    dream_log_id = ma.auto_field()
    tag_id = ma.auto_field()


dream_tag_singular_schema = DreamTagSchema()
dream_tag_plural_schema = DreamTagSchema(many=True)


class DreamTags(Resource):
    def get(self):
        dream_tags = DreamTag.query.all()
        response = make_response(dream_tag_plural_schema.dump(dream_tags))
        return response


# Authentication handling
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return {"message": "Bad username or password"}, 401

        session['user_id'] = user.id
        return make_response(user_singular_schema.dump(user), 200)


class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)


api.add_resource(Users, '/users')
api.add_resource(UsersByID, '/users/<int:id>')
api.add_resource(DreamLogs, '/dream-logs')
api.add_resource(DreamLogsByID, '/dream-logs/<int:id>')
api.add_resource(Tags, '/tags')
api.add_resource(DreamTags, '/dream-tags')

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
