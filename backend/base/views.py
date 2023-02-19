from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import CustomUser, Product,OrderItem,Orders
from django.contrib.auth.models import User
from django.contrib.auth import logout,authenticate
from .Serializer import CustomUserSerializer, ProductSerializer, OrderItemSerializer,OrderSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics


from rest_framework.exceptions import AuthenticationFailed

#AUTHENTICATION
    #logout

class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = RefreshToken(request.data.get('refresh'))
        refresh_token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


    #refresh token
class RefreshTokenView(generics.GenericAPIView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         try:
#             token = super().get_token(user)
#             # Add custom claims
#             token['username'] = user.username
#             token['junk']="bling bling"
#             # ...
#             return token
#         except jwt.ExpiredSignatureError as e:
#             raise exceptions.AuthenticationFailed('Token has expired') from e
#         except jwt.DecodeError as e:
#             raise exceptions.AuthenticationFailed('Error decoding signature') from e
#         except exceptions.AuthenticationFailed as e:
#             raise exceptions.AuthenticationFailed('Incorrect password') from e
#     #login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):

            token = super().get_token(user)
            # Add custom claims
            token['username'] = user.username
            token['junk']="junk"
            # ...
            return  token

    # register
@api_view(['POST'])
def  register(req):
    username=req.data["username"]
    password=req.data["password"]
    # create a new user (encrypt password)
    try:
        CustomUser.objects.create_user(username=username,password=password)
        return Response({username,password} )
    except Exception as e:
        if "UNIQUE" in str(e):
            return Response('Exists',status=status.HTTP_400_BAD_REQUEST) 
       

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
    serializer = CustomUserSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)




#with serializer - gets all products
@api_view(['GET','POST','DELETE','PUT','PATCH'])
# @permission_classes([IsAuthenticated])
def myProducts(req):
    if req.method== 'GET':
        all_products = ProductSerializer(Product.objects.all(), many=True).data
        return JsonResponse(all_products, safe=False)
    if req.method =='POST':
        Product.objects.create(name =req.data["name"],description=req.data["description"],price=req.data["price"])
        return Response ("post...")
    if req.method =='DELETE':
        Product.objects.delete(id=req.data["id"])
        return Response ("delted")




# //////////// image upload / display
# return all images to client (without serialize)
@api_view(['GET'])
def getImages(request):
    res=[] #create an empty list
    for img in Product.objects.all(): #run on every row in the table...
        res.append({
            "name":img.name,
                "description":img.description,
                "price":img.price,
               "image":str( img.image)
                }) #append row by to row to res list
    return Response(res) #return array as json response


# upload image method (with serialize)
class APIViews(APIView):
    parser_class=(MultiPartParser,FormParser)
    def post(self,request,*args,**kwargs):
        api_serializer=ProductSerializer(data=request.data)
       
        if api_serializer.is_valid():
            api_serializer.save()
            return Response(api_serializer.data,status=status.HTTP_201_CREATED)
        else:
            print('error',api_serializer.errors)
            return Response(api_serializer.errors,status=status.HTTP_400_BAD_REQUEST)


# //////////// end      image upload / display


#order view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order(req):
    
#order
    serializer=OrderSerializer(data={},context={'user': req.user})
    if serializer.is_valid():
            serializer.save()
    else:
        print('**************ORDER*******************')
        print('error',serializer.errors)
        print('***************ORDER******************')


    order_id = Orders.objects.latest('id').id
    print(order_id)
# items
    for i in req.data:
        product = i['id']
        order=order_id
        name=i['name']
        qty=i['amount']
        price=i['price']
        image=i['image']
        item={'product':product,'order':order,'name':name,'qty':qty,'price':price,'image':image}
        serializer=OrderItemSerializer(data=item)
        if serializer.is_valid():
            serializer.save()
        else:
            print('**************ORDER-ITEM*******************')
            print('error',serializer.errors)
            print('***************ORDER-ITEM******************')
    
    return HttpResponse (serializer.errors)


