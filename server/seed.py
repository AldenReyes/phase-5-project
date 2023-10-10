#!/usr/bin/env python3
from random import sample
from faker import Faker
from config import app
from models import db, User, DreamLog, Tag, DreamTag

fake = Faker()

with app.app_context():
    print("Deleting old data...")
    User.query.delete()
    DreamLog.query.delete()
    Tag.query.delete()
    DreamTag.query.delete()

    def seed_users(num_users=10):
        for user in range(num_users):
            user = User(username=fake.unique.user_name(), password_hash=fake.password())
            db.session.add(user)
            db.session.commit()

    def seed_dream_logs(num_dream_logs=40):
        users = User.query.all()
        for dream_log in range(num_dream_logs):
            dream_log = DreamLog(
                title=fake.sentence(),
                text_content=fake.text(max_nb_chars=500),
                is_public=fake.boolean(),
                rating=fake.random_element(["Good", "Bad", "Neutral"]),
                user=fake.random_element(users),
            )
            db.session.add(dream_log)
            db.session.commit()

    def seed_tags(num_tags=15):
        for tag in range(num_tags):
            tag = Tag(name=fake.unique.word())
            db.session.add(tag)
            db.session.commit()

    def seed_dream_tags():
        tags = Tag.query.all()
        dream_logs = DreamLog.query.all()
        for dream_log in dream_logs:
            associated_tags = sample(tags, k=fake.random_int(min=1, max=5))
            for tag in associated_tags:
                dream_tag = DreamTag(dream_log_id=dream_log.id, tag_id=tag.id)
                db.session.add(dream_tag)
                db.session.commit()

    print("Seeding new data...")
    seed_users()
    seed_dream_logs()
    seed_tags()
    seed_dream_tags()
    print("Seeding complete.")
