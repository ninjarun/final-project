from rest_framework import serializers
from .models import Product,OrderItem,Orders





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

    # def create(self, validated_data):
    #     order = self.context['order']
    #     return Orders.objects.create(**validated_data,order=order)

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Orders
        fields = '__all__'
    
    def create(self, validated_data):
        user = self.context['user']
        print(user)
        return Orders.objects.create(**validated_data,user=user)


    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

