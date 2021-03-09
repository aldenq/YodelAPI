import yodel.globaldat as globaldat
import math
import copy
def typeManagment(data):
    dtype = type(data)
    if dtype == str:
        return(bytearray(data.encode(encoding='UTF-8', errors='strict')))
    elif dtype == bytes:
        return(data) 
        
class Flags:  #class meant to be used in fields, is an array of bools, used to store flags about the packet
    # 
    #
    length = 1
    def __setitem__(self,key,value):
        if type(key) == str:
            self.data[self.lookup[key]] = value
        else:
            self.data[key] = int(value)


    def __init__(self,lookup_table): 
        
        self.data = [0,0,0,0,0,0,0,0]
        self.lookup = {} #lookup table, maps names provided by the field onto indexes in data
        self.a = 2
        if lookup_table: #check if lookup table is provided
            #print(lookup)
            for i in range(len(lookup_table)): #index lookup table, check to see if a name has been provided, if so create an entry in lookup dict with the key as the name and the value as the index 
                key = lookup_table[i]
                if key != None: #checks to see if the name provided for a given matrix is None, this is so that ["a",None,"b"] will only set a key for index 0 and 2
                    self.lookup[key] = i #create dict entry with key being a name provided and the value being the index being mapped to
                    


    
    def __getitem__(self, key):
       if type(key) == str:
           return(self.data[self.lookup[key]])
       return(self.data[key])
    
    def __bytes__(self):
        out = 0
        for i in range(8):
            
            val = self.data[7-i]
            out += val*2**i
        return(out.to_bytes(1, 'little'))
        #return(int(data,2))
    
  
    def __repr__(self):
        out = ''
        #print(self.data,"self.data")
        for i in range(8):
            val = str(int(self.data[i]))
            out += val
        return(out)
    




class Format: 
    """ formats are used to store the information needed to encode or decode data. eg: first 3 bytes are a string, next 5 are for an int, etc.

    """


    supported_types = [int,str,bytearray,Flags] 


 
    
    def __init__(self, fields,mtype:int=0):
        self.mtype:int = mtype#kwargs.get("mtype", 0) #get message type
        
        self.fields_dict = {}  #dictionary that holds field data formated as field name: field value
        self.fields:list = fields   #fields holds the list of fields provided, still holds lots of useful meta data so it is kept around
        self.output:dict = {} #dict that holds field names and values, this is so that sections on init can just copy the info from here rather than regenerating it

        if self.mtype != 0: #when a format is created and the message type is not zero store it in the array of message types so that autoDecode can use the format
            globaldat.messages_types[self.mtype] = self
       
        for i in range(len(fields)): #copy data over and init output with field names
            fname = fields[i].name
            self.output[fname] = 0
            self.fields_dict[fname] = fields[i] 


        #self.gen_data()
        


        
    
class Section:
    """
    sections are used to store data and the meta-data needed to encode that data. 
    to get extract all of the data in a section use:
    section.fields

    sections can be encoded by using bytes(section), also, if a section is used in yodel.send it will automatically handle it.





    """
    
    def print(self): #fancy print 
        
        type_lookup = {
        bytearray:"Bytearray",
        int:"Int",
        Flags:"Flags",
        bytes:"bytes",
        str:"String"
        }
                
        for i in list(self.fields.keys()):
            name_len = len(str(i))
            space = 20

            dat_len = len(str(self.fields[i]))
            space2 = 20
            #print(dir(self.__dict__["format"].fields_dict[i]))
            #print(self.__dict__["format"].fields_dict[i].len)
            #print("a")
            field_type  = self.__dict__["format"].fields_dict[i].type
            #print(objt)
            

           


            print_type = type_lookup[field_type]
            if dat_len < space2:
                space2 = space2-dat_len
            if name_len < space:
                space = space - name_len
                
            
            if field_type == str:    
                print(f"{i}:{' '*space}\"{self.fields[i]}\"{' '*(space2 - 2)}{print_type}") #print rules for strings
            elif field_type == int:    
                print(f"{i}:{' '*space}{self.fields[i]}{' '*(space2)}{print_type}") #print rules for ints
            elif field_type == Flags:    
                print(f"{i}:{' '*space}{self.fields[i]}{' '*(space2)}{print_type}     {list(self.fields[i].lookup.keys())}") #print rules for flags
            elif field_type == bytearray:
                 print(f"{i}:{' '*space}{self.fields[i]}{' '*(space2)}{print_type}")
        print(f"payload:{' '*space}{self.payload}" )


    def __bytes__(self):
        return(evalBytes(self.__dict__["fields"],self.__dict__["format"],self.__dict__["payload"]))
    
    def __setattr__(self, name, value):
        #print("set", name , value)
        if name != "payload":
            self.fields[name] = value
        else:
            self.__dict__["payload"] = value
        
    
    def __getattr__(self, name): 
        #print(name,"name")
        if name != "payload":
            return(self.fields[name])
        else:
            return(self.__dict__["payload"])
       

    def __setitem__(self,key,value):
        self.fields[key] = value
        
    def __getitem__(self, key):
       return(self.fields[key])
    
    def __str__(self):
        return(str(self.fields))

    def __init__(self,format):
        self.__dict__["format"]:format = format #store format so that it can be accessed later as necessary
        self.__dict__["fields"]:dict = copy.copy(format.output)  #copy empty dict from format which has names already set
        self.__dict__["payload"]:bytearray= b'' #holds anything that comes after all fields have been filled




        
    




class Field:  #used to create new fields, a field being a section of memory meant to hold one value
    def __init__(self,Name,Type,*args,bytes=False,min=False,max=False):
        #print(Name,Type)
        bytes_len:int =bytes
        #Min = Min
        #Max = kwargs.get("max", False)
        #self.type = Type
        if Type == int:
            #print("running",bytes_len)

            self.min = min
            self.max = max
            if bytes_len:
                #print("bf")
                self.len = bytes_len
                #print(self.len,"flen",bytes_len)
                self.min = -1 * 2**((bytes_len*8)-1)  #signed integers are encoded using sign and magnitude
                self.max = 2**((bytes_len*8)-1)-1
                #print(self.min,self.max, "min,max")
            else:
                self.len = math.ceil((max-min).bit_length()/8) #when type is an int len tells us the amount of bits needed to represent the possble options. when type is a str len tells us the amount of bits needed to store the length of the string
            #self.len  =4
        elif Type == str or Type == bytearray: #
            if bytes_len:
                max = bytes_len
            self.min = min
            self.max = max
            
            self.len = math.ceil((max-min).bit_length()/8)
           
        elif Type == Flags:
                self.min= 0
                self.max = 0
                self.len = 1 #flags type is always one byte long
                if len(args) == 1:
                    self.lookup = args[0]  #take the array that holds the bit names 
                else:
                    self.lookup = False
      
        
        
                
        self.name = Name #field name
        self.type = Type #field data type
        #self.len = math.ceil((Max-Min).bit_length()/8) #when type is an in len tells us the amount of bits needed to represent the possble options. when type is a str len tells us the amount of bits needed to store the length of the string
        
def decode(data,encoding):
    fnames = list(encoding.fields_dict.keys()) #returns list of all field names
    output = Section(encoding) #generate new section object to store output
    cpos = 0 #current position, sort of a pointer to the bytearray
    for field in range(len(fnames)):
        fname = fnames[field] #field name
        fieldobj = encoding.fields_dict[fname]
        ftype = fieldobj.type #data type of the field
        flen = fieldobj.len #field length
        fdata = data[cpos:cpos+flen] #take the next n bytes where n is the length of the field
        cpos += flen #incriment the current position by the length of the field
        fmin = fieldobj.min #min field value
        
        #all data types need their own custom decoding scheme
        
        if ftype == str:
            strlen = globaldat.getInt(fdata) #get the size of the string by taking the first flen bytes and converting them to an int
            strlen += fmin
            strdat = data[cpos:cpos+strlen] #return the next n bytes where n is the length of the string defined by strlen
            cpos += strlen #move current position forward by the length of the string
            output[fname] = strdat.decode("utf-8") #decode bytes as utf-8
            
            
        elif ftype == bytearray:
            bytelen = globaldat.getInt(fdata) #get the size of the bytearray by taking the first flen bytes and converting them to an int
            bytelen += fmin
            strdat = data[cpos:cpos+bytelen] #return the next n bytes where n is the length of the string defined by bytelen
            cpos += bytelen #move current position by the length of the byte array
            output[fname] = strdat #move the raw bytes into the appropriate place in the class
            
            
        elif ftype == int:
            fout = globaldat.getInt(fdata)
            fout += fmin
            output[fname] = fout
            
        elif ftype == Flags: 
            output[fname] = Flags([])
            fout = list(bin(globaldat.getInt(fdata))[2:]) #because this is python the only way to turn a byte into a list of bits is to first convert it to an int, convert it to a utf-8 encoded string of bits, and split that list, than convert all the terms into ints and return that as a list
            fout= list(map(int,fout))
            fout = [0]*(8-len(fout)) + fout #add appropriate 0 padding depedning on the length
            
            output[fname].data =fout
            
        
                    
            
            
        
    output.payload = data[cpos:]      
    return(output)
        
        

            
def evalBytes(field_dict, format,payload): #used in the __bytes__ method in the section class. is used to return the bytes based on the field dict.
    #field_dict is a dictionary where the keys are field names, and the values are the values of those fields
    
    out = b'' #output is bytearray
    #print(field_dict,"fdata")
    for i in format.fields_dict.keys():
        field_data = field_dict[i]
        
        format_field = format.fields_dict[i]  #take the field from the format
        field_type = format_field.type #get the expected data type of the field
        #print(field_type)
        #fmax = format_field.max 
        fmin = format_field.min #min length(when refering to bytearray or string)/ value(when refering to an int)
        flen = format_field.len #length in bytes of field
        
        if field_type == type(field_data): #check if the expected data type matches the actual type
            
            if field_type == int:   
                #the amount of bytes for the int is included in the standard so it does not need to be added to the output
                #print(field_data,flen ,format_field.min,i, "field_data,field_len")
                field_data -= format_field.min
                #print(field_data,flen) 
                
                out += field_data.to_bytes(flen, 'little')
                 
                #print(field_data.to_bytes(flen, 'little'),"int dat")
            elif field_type == Flags: #flags are always 1 byte
                out += bytes(field_data)
                
            elif field_type == str: 
                field_len = len(field_data)
                field_len -= fmin #minimum length is subtracted because the reciever will add the min back before reading the bytes

                #print(flen,field_len,"string")
                out += field_len.to_bytes(flen, 'little') #for string the length of the string first needs to be added as an int before the string data
               
                out += bytearray(field_data.encode(encoding='UTF-8', errors='strict')) #strings are encoded as a utf-8 string
                
            elif field_type == bytearray:
                field_len = len(field_data)
                field_len -= fmin
                out += field_len.to_bytes(flen, 'little') #like strings, with byte arrays the length is added prior to the data
                out += field_data
            

          
                



            
            pass
        #else:
            #print("bad",field_data,field_type,i)
    out += payload        
    return(out)


def autoDecode(data):
    mtype = data.mtype
    if mtype != 0 :
        byte_data = data.payload
        #print(mtype)
        return(decode(byte_data,globaldat.messages_types[mtype]))
    else:
        return(data.payload)




        