from django.db import models

# We certainly don't need to model cards this way, but let's do it :)

class Suit(models.Model):
    def __str__(self) -> str:
        return self.short_form
    
    id = models.AutoField(primary_key=True)
    long_form = models.CharField(max_length=10)
    short_form = models.CharField(max_length=1)

class CardValue(models.Model):
    def __str__(self) -> str:
        return self.short_form

    id = models.AutoField(primary_key=True)
    long_form = models.CharField(max_length=10)
    short_form = models.CharField(max_length=1)
    value = models.IntegerField(default=1)

class Card(models.Model):
    def __str__(self) -> str:
        return "%s of %s" % (self.card, self.suit.long_form)

    id = models.AutoField(primary_key=True)
    suit = models.ForeignKey(Suit, on_delete=models.PROTECT)
    card = models.ForeignKey(CardValue, on_delete=models.PROTECT)

class Player(models.Model):
    id = models.AutoField(primary_key=True)
    external_id = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    chip_balance = models.IntegerField()
    cash_balance = models.IntegerField()