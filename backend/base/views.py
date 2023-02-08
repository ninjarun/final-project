from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import Product
from django.contrib.auth.models import User
from django.contrib.auth import logout
from .Serializer import ProductSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics


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


    #login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['junk']="bling bling"
        # ...
        return token
    
    # register
@api_view(['POST'])
def  register(req):
    username=req.data["username"]
    password=req.data["password"]
    # create a new user (encrypt password)
    try:
        User.objects.create_user(username=username,password=password)
    except Exception as e:
        return Response("error")    
    return Response(f"{username} registered")

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




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

