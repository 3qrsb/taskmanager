# Generated by Django 5.0.7 on 2024-07-27 20:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0004_note_alter_task_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='note',
            options={'ordering': ['-created_at']},
        ),
    ]
