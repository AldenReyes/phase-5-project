#!/usr/bin/env python3
from flask import Flask, request, make_response
from flask_restful import Resource
from flask_restful import Api, Resource
from marshmallow import validate, fields
from config import api, app, db, ma
from models import User, DreamLog, Tag, DreamTag


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

    def post(self):
        try:
            data = request.json
            user_data = user_singular_schema.load(data)

            new_user = User(
                username=user_data["username"],
                password_hash=user_data.get("password", ""),
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


class DreamLogsByID(Resource):
    def get(self, id):
        dream_log = DreamLog.query.filter_by(id=id).first()
        response = make_response(dream_log_singular_schema.dump(dream_log), 200)
        return response


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


api.add_resource(Users, '/users')
api.add_resource(UsersByID, '/users/<int:id>')
api.add_resource(DreamLogs, '/dream-logs')
api.add_resource(DreamLogsByID, '/dream-logs/<int:id>')
api.add_resource(Tags, '/tags')
api.add_resource(DreamTags, '/dream-tags')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
