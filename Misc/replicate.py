# This takes the template site and makers one for each product
# Replace string: *REPLACE*
# nav style: <li><a href="/incompleteOrders.html">Incomplete Orders</a></li>
from pymongo import MongoClient
import os
replaceString = '*REPLACE*'
client = MongoClient('mongodb://localhost:27017/')
db = client['SpartanMan']
col = db['products']
cursor = col.find({})
names = [] # names of pages that need to be completed
for document in cursor:
    names.append(document['name'])
names.sort()
for name in names:
    # read file
    script_dir = os.path.dirname(__file__)
    with open(script_dir + '/templateSite.html', 'r') as file:
        filedata = file.read()
    # replace replaceString
    filedata = filedata.replace(replaceString, name)
    #write file out
    rel_path = "../public/productSites/"
    abs_file_path = os.path.join(script_dir, rel_path)
    with open(abs_file_path + str(name).replace(" ", "").replace("/","")+'.html', 'w') as file:
        file.write(filedata);
print("Successfully changed files...")
# Navigation bar
navStr = ""
temp = '<li><a href="*LINK*">*NAME* Orders</a></li>\n'
for name in names:
    cp = temp
    link = cp.replace("*LINK*", "/productSites/"+name.replace(" ","").replace("/","")+".html")
    name = link.replace("*NAME*", name)
    navStr += name
# read file
script_dir = os.path.dirname(__file__)
with open(script_dir + '/navigation.html', 'r') as file:
    filedata = file.read()
# replace replaceString
filedata = filedata.replace(replaceString, navStr)
#write file out
rel_path = "../public/"
abs_file_path = os.path.join(script_dir, rel_path)
with open(abs_file_path + '/navigation.html', 'w') as file:
    file.write(filedata);
