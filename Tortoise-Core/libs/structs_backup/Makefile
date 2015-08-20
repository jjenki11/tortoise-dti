CC=gcc
CFLAGS=-I.
DEPS = AtlasStruct.h
OBJ = AtlasStruct.o AtlasBuilder.o 

%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

AtlasStruct: $(OBJ)
	gcc -o $@ $^ $(CFLAGS)

