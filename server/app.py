#!/usr/bin/env python3
from flask import Flask, request, make_response
from flask_restful import Resource
from flask_restful import Api, Resource
from marshmallow import validate, fields
from config import app, ma, api
from models import User, DreamLog, Tag, DreamTag


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    username = fields.Str(required=True, validate=validate.Length(min=4, max=30))


user_singular_schema = UserSchema()
user_plural_schema = UserSchema(many=True)


class Users(Resource):
    def get(self):
        users = User.query.all()
        response = make_response(user_plural_schema.dump(users), 200)
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
api.add_resource(DreamLogs, '/dream-logs')
api.add_resource(DreamLogsByID, '/dream-logs/<int:id>')
api.add_resource(Tags, '/tags')
api.add_resource(DreamTags, '/dream-tags')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
