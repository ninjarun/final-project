from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import CustomUser, Product, OrderItem, Orders
from django.contrib.auth.models import User
from django.contrib.auth import logout, authenticate
from .Serializer import CustomUserSerializer, ProductSerializer, OrderItemSerializer, OrderSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics

import paypalrestsdk
from django.shortcuts import redirect
from django.urls import reverse


# AUTHENTICATION

# logout
class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = RefreshToken(request.data.get('refresh'))
        refresh_token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

# refresh token
class RefreshTokenView(generics.GenericAPIView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


#login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['junk'] = "junk"
        # ...
        return token
    

# register
@api_view(['POST'])
def register(request):
    try:
        # Extract username and password from the request data
        tmp=request.data
        print('******************',tmp)
        username = request.data["username"]
        password = request.data["password"]
        address = request.data["address"]
        phone_number= request.data["phone_number"]
        email=request.data["email"]

        # Create a new user and save it to the database
        user = CustomUser.objects.create_user(username=username, password=password,address=address,phone_number=phone_number,email=email)

        # Get tokens for the new user
        serializer = MyTokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data

        # Return the tokens along with the user data
        serializer = CustomUserSerializer(user, many=False)
        response_data = {
            "tokens": tokens,
            "user": serializer.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        if "UNIQUE" in str(e):
            return Response("ERROR: UserName Exists", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("ERROR: " + str(e), status=status.HTTP_400_BAD_REQUEST)



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Profile

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serilaizer = CustomUserSerializer(user, many=False)
    return Response(serilaizer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = CustomUserSerializer(
        instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


# with serializer - gets all products
@api_view(['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
# @permission_classes([IsAuthenticated])
def myProducts(req):
    if req.method == 'GET':
        all_products = ProductSerializer(Product.objects.all(), many=True).data
        return JsonResponse(all_products, safe=False)
    if req.method == 'POST':
        Product.objects.create(
            name=req.data["name"], description=req.data["description"], price=req.data["price"])
        return Response("post...")
    if req.method == 'DELETE':
        Product.objects.delete(id=req.data["id"])
        return Response("delted")


# //////////// image upload / display
# return all images to client (without serialize)
@api_view(['GET'])
def getImages(request):
    res = []  # create an empty list
    for img in Product.objects.all():  # run on every row in the table...
        res.append({
            "name": img.name,
            "description": img.description,
            "price": img.price,
            "image": str(img.image)
        })  # append row by to row to res list
    return Response(res)  # return array as json response


# upload image method (with serialize)
class APIViews(APIView):
    parser_class = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        api_serializer = ProductSerializer(data=request.data)

        if api_serializer.is_valid():
            api_serializer.save()
            return Response(api_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', api_serializer.errors)
            return Response(api_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
            try:
                product = Product.objects.get(pk=pk)
            except Product.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
# //////////// end      image upload / display


# order view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order(req):

    # order
    serializer = OrderSerializer(data={}, context={'user': req.user})
    if serializer.is_valid():
        serializer.save()
    else:
        print('**************ORDER*******************')
        print('error', serializer.errors)
        print('***************ORDER******************')

    order_id = Orders.objects.latest('id').id
    print(order_id)
# items
    for i in req.data:
        product = i['id']
        order = order_id
        name = i['name']
        qty = i['amount']
        price = i['price']
        image = i['image']
        item = {'product': product, 'order': order, 'name': name,
                'qty': qty, 'price': price, 'image': image}
        serializer = OrderItemSerializer(data=item)
        if serializer.is_valid():
            serializer.save()
        else:
            print('**************ORDER-ITEM*******************')
            print('error', serializer.errors)
            print('***************ORDER-ITEM******************')

    return HttpResponse(serializer.errors)


################################
######## PAYPAL PAYMENT #########
###############################
class PaymentView(APIView):
    def post(self, request, *args, **kwargs):
        paypalrestsdk.configure({
            'mode': 'sandbox',
            'client_id': 'Acv35MxVCkOUiuPZvxSGnEhK7-RGjVWQvxtxbhDpALeyCVBoa5o3gnRSYvb9aiYCdZaz9VjPkjQOcGef',
            'client_secret': 'EBMG8RagenXP9cFpGO5nHxD4f99hrkA2i-ipgLr5UN4KA3mx0NDjMF2ZOSnjIwyjp6EtJVA6mab99-TP'
        })

        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": request.build_absolute_uri(reverse('execute-payment')),
                "cancel_url": request.build_absolute_uri(reverse('cancel-payment')),
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Item Name",
                        "sku": "Item SKU",
                        "price": "10.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": "10.00",
                    "currency": "USD"
                },
                "description": "Item Description"
            }]
        })

        if payment.create():
            payment_url = [link.href for link in payment.links if link.rel == 'approval_url'][0]
            request.session['payment_id'] = payment.id
            return redirect(payment_url)
        else:
            return Response(payment.error, status=status.HTTP_400_BAD_REQUEST)


class ExecutePaymentView(APIView):
    def get(self, request, *args, **kwargs):
        paypalrestsdk.configure({
            'mode': 'sandbox',
            'client_id': 'Acv35MxVCkOUiuPZvxSGnEhK7-RGjVWQvxtxbhDpALeyCVBoa5o3gnRSYvb9aiYCdZaz9VjPkjQOcGef',
            'client_secret': 'EBMG8RagenXP9cFpGO5nHxD4f99hrkA2i-ipgLr5UN4KA3mx0NDjMF2ZOSnjIwyjp6EtJVA6mab99-TP'
        })

        payment_id = request.session.get('payment_id')
        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({'payer_id': request.GET.get('PayerID')}):
            # TODO: Process successful payment
            return Response({'message': 'Payment executed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response(payment.error, status=status.HTTP_400_BAD_REQUEST)


class CancelPaymentView(APIView):
    def get(self, request, *args, **kwargs):
        # TODO: Handle payment cancellation
        return Response({'message': 'Payment was cancelled'}, status=status.HTTP_200_OK)
