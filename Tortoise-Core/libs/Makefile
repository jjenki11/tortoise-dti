OBJS = AtlasTest.o
HOBJ = hello_world.o
CC = g++
DEBUG = -g
CFLAGS = -Wall -c $(debug)
LFLAGS = -Wall $(DEBUG)
EXE= atlas hello
ILIST=-I/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/DrChipDbg/
LLIST= /stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/DrChipDbg/xtdio.a -lpthread -lm
MYFLAGS=-DDEBUG -DDEBUG_TEST ${ILIST}
MYLIBS=${LLIST}


all : $(EXE)
	echo "Done making all executables"


atlas : $(OBJS)
	$(CC) $(LFLAGS) $(OBJS) -o atlas

hello : $(HOBJ)
	$(CC) $(LFLAGS) $(HOBJ) -o hello
	ln -s hello helloB

AtlasTest.o : 
	$(CC) $(CFLAGS) $(MYFLAGS) $(MYLIBS) AtlasTest.cpp AtlasUtils.h
	
hello_world.o : 
	$(CC) $(CFLAGS) $(MYFLAGS) $(MYLIBS) hello_world.cpp
	
clean : 
	/bin/rm *.o atlas hello *.gch helloB

tar:
	tar cvf atlas.tar AtlasTest.cpp AtlasUtils.h hello_world.cpp

