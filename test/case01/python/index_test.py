# from ..prisma.generated.python import models

# from case01.prisma.generated.python import models, fields, Client, generator
from case01.prisma.generated.python import types, Client

def func(x):
    return x + 1

def test_answer():
    assert func(3) == 4

def test_models():
    print("OKOKOK")
    
   
    for i in dir(types):
         print(i)
    assert 1 == 1