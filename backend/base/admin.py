from django.contrib import admin
from .models import Product,OrderItem,Orders
# Register your models here.
admin.site.register(Product)
admin.site.register(Orders)
admin.site.register(OrderItem)