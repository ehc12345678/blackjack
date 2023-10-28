# Generated by Django 4.2.5 on 2023-10-16 17:21

from django.db import migrations

def add_cards(apps, schema_editor):
    Suit = apps.get_model("blackjack", "Suit")
    suits = [
        Suit(long_form = "Spades", short_form="S"),
        Suit(long_form = "Clubs", short_form="C"),
        Suit(long_form = "Diamonds", short_form="D"),
        Suit(long_form = "Hearts", short_form="H")
    ]
    for suit in suits:
        suit.save()

    CardValue = apps.get_model("blackjack", "CardValue")
    card_values = [
        CardValue(long_form="Ace", short_form="A"),
        CardValue(long_form="Deuce", short_form="2"),
        CardValue(long_form="Three", short_form="3"),
        CardValue(long_form="Four", short_form="4"),
        CardValue(long_form="Five", short_form="5"),
        CardValue(long_form="Six", short_form="6"),
        CardValue(long_form="Seven", short_form="7"),
        CardValue(long_form="Eight", short_form="8"),
        CardValue(long_form="Nine", short_form="9"),
        CardValue(long_form="Ten", short_form="10"),
        CardValue(long_form="Jack", short_form="J"),
        CardValue(long_form="Queen", short_form="Q"),
        CardValue(long_form="King", short_form="K"),
    ]
    for card_value in card_values:
        card_value.save()

    Card = apps.get_model("blackjack", "Card")
    for suit in suits:
        for card_value in card_values:
            Card(suit = suit, card = card_value).save()

class Migration(migrations.Migration):

    dependencies = [
        ('blackjack', '0002_rename_foreign_id_fields'),
    ]

    operations = [
        migrations.RunPython(add_cards),
    ]
