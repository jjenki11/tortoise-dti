
#include <stdio.h>
#include <vector>
#include <map>
#include <utility>
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
#include "AtlasUtils.h"
#include "xtdio.h"

using 
    namespace 
            std;

/*  
    Main function will read cmd line and do necessary setup, nothing too fancy
*/

int 
main(int argc, char **argv)
{
    std::string arg1 = argv[1];
    std::string arg2 = argv[2];
    
    printf("%d",argc);    
    
    list<string> maps = get_file_mappings(arg1);
    print_string_list(maps);
    list<std::pair<string, string> > var_path_maps = make_var_path_pairs(maps);
    std::cout << "Created Variable to path maps \n";  
    std::cout << "Created Groups from the following files:\n";

    list<string> rels = get_relation_mappings(arg2);

    atlas a1 = make_atlas_relations(rels);

    // create_groups will only use dtireg to create templates for the 'starter' nodes (i.e. - not the final target)    
    a1.groups = create_groups( var_path_maps, 1 );

    print_group_labels( a1 );
    
    
    
    //a1.transforms = 
    
    ///////////
    create_transforms( a1 );
    ///////////
    reg_and_combine( "1234", "/raid1e/Jeff/final_test_folder/working", "p", "c" );
    
    
    //print_group_labels( a1 );
    
    
    /*
        runExternal_CombineTransformations_helper("1234", 
                        "/raid1e/Jeff/tester/target_atlas/target_atlas_DT.nii", 
                        "/raid1e/Jeff/tester/working/atlas0/average_template_diffeo_6.nii"
                        "/stbb_home/jenkinsjc/Desktop/combined_transformations_x_y.nii"
        );
    */
    
    
    /*
    std::cout << "\nAssigned group list to atlas\n";
    print_group_labels( a1 );

    std:: cout << "\nAssigned group relations in atlas \n";
    print_group_relations( a1 );
    a1.relations = generate_intermediate_graphs(a1);
    std::cout << "\nUpdate group relations with sub-rels \n";
    print_group_relations( a1 );
    
    if(argc > 3)
    {
        std::string arg3 = argv[3];
        // OPTIONAL -> this is just usage for how to get a group given the atlas and a label as the args
        group p2 = get_group_with_label(a1, arg3);
        std::cout << "GROUP has the label: " << p2.label << std::endl;    
        std::cout << "Subjects of group " << p2.label << ":" << std::endl;
        print_subject_paths(p2);
    }
    
    
    std::cout << "FINAL TARGET === " << get_final_target(a1) << std::endl;
    
    */
    /*
    
    std::cout<<"\nNOW TO TRY THE DIGRAPH IMPLEMENTATION\n"<<std::endl;
    
    NGraph::Graph A;
    A.insert_edge(0,1);
    A.insert_edge(1,2);
    A.insert_edge(0,2);
    A.insert_edge(3,0);
    
    std::cout << "Graph has " << A.num_vertices() << " vertices and "
        << A.num_edges() << " edges.\n";
    A.print();   
   
    list<group> groups = get_groups(a1);
    */
    
    /*
    runExternal_DTIREG_Create_Template("1234",
                                      "/raid1e/Jeff/cpp_test_data/patients/patient_DT_list.txt",
                                      "0",
                                      "/raid1b/STBBapps/DTIREG/bin/"
    );
    */
   //runExternal_DTIREG("1234",
                      
   
   
   
    /*
    runExternal_Batch_Import_DTIREG("1234",
                                    "/raid1e/Jeff/tester/working/atlas0/read_path.txt"
                                    
    );  
    */
    
    /*
    runExternal_DTIREG_Create_Template("1234",
                                       "/raid1e/Jeff/tester/working/atlas0/tmp.txt",
                                       "0",
                                       "/raid1b/STBBapps/DTIREG/bin/"
    );
    */
    
    /*
    runExternal_CombineTransformations("1234", 
                        "/raid1e/Jeff/tester/target_atlas/target_atlas_DT.nii", 
                        "/raid1e/Jeff/tester/working/atlas0/average_template_diffeo_6.nii"
    );
    */
    
    /*
    runExternal_ApplyTransformationToTensor("1234",
                      "/raid1e/Jeff/tester/working/atlas0/PAT_200_SCAN1_DMC_L0_DT.nii", 
                      "/raid1e/jeff/tester/working/atlas0/combined_displacement_PAT_200_SCAN1_DMC_L0_DT.nii",
                      "/raid1e/jeff/tester/working/atlas0/SAMPLEZOUTPUTPUT.nii",
                      "/raid1e/jeff/tester/working/atlas0/average_template_diffeo_6.nii"
    );
    */
    
    /*
    runExternal_DTIREG("1234", 
                       "/raid1e/Jeff/tester/target_atlas/target_atlas_DT.nii", 
                       "/raid1e/Jeff/tester/working/atlas0/average_template_diffeo_6.nii"
    );
    */ 
      
    return 0;   
};

