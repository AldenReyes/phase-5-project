from sqlalchemy import ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from app import bcrypt
from config import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    dream_logs_id = db.relationship('Dream_log', back_populates="user")

    def __repr__(self):
        return f'User_ID {self.id}, username {self.username}'

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))


class DreamLog(db.Model):
    __tablename__ = 'dream_logs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    text_content = db.Column(db.String(500), nullable=False)
    is_public = db.Column(db.Boolean, nullable=False)
    rating = db.Column(db.String)

    published_at = db.Column(db.DateTime, server_default=db.func.now())
    edited_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    user = db.relationship('User', back_populates="dream_logs")

    tags = db.relationship('Tag', secondary='dream_tags', back_populates='dream_logs')

    def __repr__(self):
        return f'Dream_log_ID {self.id}, is_public {True if self.is_public == 1 else False} published at {self.published_at}'


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    dream_logs = db.relationship(
        'Dream_log', secondary='dream_tags', back_populates='tags'
    )

    def __repr__(self):
        return f'Tag_ID {self.id}, name {self.name}'


class DreamTag(db.Model):
    # Joint table
    __tablename__ = 'dream_tags'

    id = db.Column(db.Integer, primary_key=True)
    dream_log_id = db.Column(db.Integer, ForeignKey('dream_logs.id'), nullable=False)
    tag_id = db.Column(db.Integer, ForeignKey('tags.id'), nullable=False)
