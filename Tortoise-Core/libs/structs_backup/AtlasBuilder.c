#include <stdio.h>
#include <string.h> 
#include <stdbool.h>
#include <AtlasStruct.h>


void printAtlas( struct Atlas *atl )
{
   printf( "Book title : %s\n", atl->title);
   printf( "Book author : %s\n", atl->author);
   printf( "Book subject : %s\n", atl->subject);
   printf( "Book book_id : %d\n", atl->book_id);
}

void readGroupFile( )
{
	FILE *fr;            /* declare the file pointer */
	int n;
	long elapsed_seconds;
	char line[255];
	fr = fopen ("group_file.txt", "rt");

    Atlas[] aList = InitializeArray<Atlas>(2);
	int i = 0;

	while(fgets(line, 255, fr) != NULL)
	{
		struct Atlas at;
		strcpy( at.title, &line);
        aList[i] = at;
	}
	fclose(fr);
}

void printAtlasList (Atlas[] arr)
{
	for (int i = 0; i < 2; ++i)
    {
        printAtlas(arr[i]);
    }
}
