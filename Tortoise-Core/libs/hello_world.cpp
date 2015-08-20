#include <stdio.h>
#include <string>
#include <setjmp.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <setjmp.h>
#include <signal.h>
#include <list>
#include <algorithm>
#include <sstream>
#include <iostream>
#include <string>
#include <stdio.h>
#include <cstring>
#include "xtdio.h"

int main(int argc, char **argv)
{
    char *cmd[] = {"/raid1e/raid1_restore/codes/my_codes/DTIReg/DTIReg/DTIREG", "--fixed_tensor \"/raid1e/Jeff/tester/target_atlas/target_atlas_DT.nii\" --moving_tensor \"/raid1e/Jeff/tester/working/atlas0/average_template_diffeo_6.nii\" --metric DTITK --metric Trace -t SyN\[0.75,3,0.5\] -c 100x100x100 -f 4x2x1 -s 0.5x0.25x0 --final_reorientation FS", NULL};
    execv("/raid1e/raid1_restore/codes/my_codes/DTIReg/DTIReg/DTIREG",cmd);

    std::cout << "Hello World " << argv[1] << "Starting... \n" << std::endl;
    for(int i = 0; i < argc; i++)
    {
      printf("arg #%d: %s\n",i, argv[i]);
    }
    std::cout << "Hello World " << argv[1] << "Ending..." << std::endl;    

    

    kill(atoi(argv[2]), 9);
    return 1;
}
