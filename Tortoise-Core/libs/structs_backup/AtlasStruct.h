/* function declaration */
#include <stdio.h>
#include <string.h>
struct Atlas
{
   char  title[50];
   char  author[50];
   char  subject[100];
   int   book_id;
   char  filename[255];
};

struct Group
{
    
};

struct Subject
{


};

T[] InitializeArray<T>(int length) where T : new()
{
    T[] array = new T[length];
    for (int i = 0; i < length; ++i)
    {
        array[i] = new T();
    }

    return array;
}

void printAtlas( struct Atlas *atl );

void readGroupFile( void );





