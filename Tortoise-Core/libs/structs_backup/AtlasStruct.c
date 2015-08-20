#include <AtlasStruct.h>

int main( int argc, char **argv )
{
   struct Atlas Atlas1;        /* Declare Book1 of type Book */
   struct Atlas Atlas2;        /* Declare Book2 of type Book */

   printf("arg 1 = %s\n", argv[1]);
 
   /* book 1 specification */
   strcpy( Atlas1.title, "C Programming");
   strcpy( Atlas1.author, "Nuha Ali"); 
   strcpy( Atlas1.subject, "C Programming Tutorial");
   Atlas1.book_id = 6495407;

   /* book 2 specification */
   strcpy( Atlas2.title, "Telecom Billing");
   strcpy( Atlas2.author, "Zara Ali");
   strcpy( Atlas2.subject, "Telecom Billing Tutorial");
   Atlas2.book_id = 6495700;
 
   /* print Book1 info by passing address of Book1 */
   printAtlas( &Atlas1 );

   /* print Book2 info by passing address of Book2 */
   printAtlas( &Atlas2 );

   readGroupFile( /*argv[1]*/ );

   return 0;
}
