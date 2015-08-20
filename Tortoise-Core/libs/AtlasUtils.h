#include <list>
#include <algorithm>
#include <sstream>
#include <iostream>
#include <string>
#include <stdio.h>
#include <string>
#include <cstring>
#include <setjmp.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include "AtlasGraphUtils.h"

using 
    namespace 
            std;

/*  
    Subject structure
*/
struct 
subject {
	int index;    // order in list (?)
	string name;  // name without *.nii extension
	string path;  // path to nii file
};

/*  
    Group structure
*/
struct 
group {
	list<subject> subjects; // list of JSON objects for graph
	list<string> transforms;  // transforms in queue for procedure
	string label;         // <group_name>
	string path;          // <name>_list.txt
	string template_path; // average_diffeo_6.nii
	bool final_target;    // is this the final target?  a.k.a. is an atlas without subject data
};

/*  
    Atlas structure
*/
struct 
atlas {
	// list<std::pair<group, group> > groupRelations; // TBD
    list<group> groups;                           // list of group nodes
    list<std::pair<string, string> > relations;   // list of relations requiring relations(i).first -> relations(i).second
    list<std::pair<string, string> > transforms;  // transforms in queue for procedure
    string label;                                 // possibly could have more than one atlas object
};


/************ BELOW ARE (BLOCKING) FUNCTIONS WHICH CALL EXTERNAL FUNCTIONALITY  ************/

/*
  CombineTransformations  
*/
int
runExternal_CombineTransformations(char *ppid, char *arg1, char *arg2 )
{
    std::cout << "Combining Transformations ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */
    
        execl("/raid1b/STBBapps/DTIREG/bin/CombineTransformations", 
              "/raid1b/STBBapps/DTIREG/bin/CombineTransformations", 
              arg1,
              arg2,
              (char *)0
        );

        perror("execl error"); 
        _exit(0); 
    }    
};

/*
  CombineTransformations helper
*/
int
runExternal_CombineTransformations_helper(char *ppid, char *arg1, char *arg2, char *arg3 )
{
    std::cout << "Combining Transformations with helper ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */
    
        execl("/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/combine_xform_helper.sh",
              "/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/combine_xform_helper.sh",
              arg1,
              arg2,
              arg3,
              (char *)0
        );
        perror("execl error"); 
        _exit(0); 
    }
};

/*
  ApplyTransformationToTensor -> <original>, <combined_displacement>, <output_file>, <reorientation_type>, <provide final atlas for correct dimensions>
*/
int
runExternal_ApplyTransformationToTensor(char *ppid, char *orig_tens, char *comb_disp, char *out_file, char *ref_size )
{    
    std::cout << "Applying Transformation to Tensor ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */
    
        execl("/raid1b/STBBapps/DTIREG/bin/ApplyTransformationToTensor", 
              "/raid1b/STBBapps/DTIREG/bin/ApplyTransformationToTensor", 
              orig_tens,
              comb_disp,
              out_file,
              "FS",
              ref_size,
              (char *)0
        );
        perror("execl error"); 
        _exit(0);  
    }
};

/*
  Batch_Import_DTIREG
*/
int
runExternal_Batch_Import_DTIREG(char *ppid, char *file_path )
{
    std::cout << "Running DTIREG create template ..." << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */
    
        execl("/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/idl_help_script.sh",
              "/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/idl_help_script.sh",
              file_path,
              (char *)0
        );
        perror("execl error"); 
        _exit(0);
    }
};
/*
  DTIREG_Create_Template
*/
int
runExternal_DTIREG_Create_Template(char *ppid, char *txt_file, char *step_num, char *path_to_exe)
{
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { // I am the parent - wait for the child to finish //
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { // I am the child rawr //
        string tf(txt_file);
        if(tf.empty())
        {
            std::cout << "NO FILE PROVIDED, SKIPPING." << std::endl;
            _exit(0);
        }
        else
        {
            std::cout << "Running DTIREG create template ..." << std::endl;
            execl("/raid1b/STBBapps/DTIREG/bin/dtireg_create_template_jeff",
                  "/raid1b/STBBapps/DTIREG/bin/dtireg_create_template_jeff",
                  txt_file,
                  step_num,
                  path_to_exe,
                  (char *)0
            );
            perror("execl error"); 
            _exit(0);
        }
    }    
    return 1;
}
/*
  DTIREG
*/
int
runExternal_DTIREG(char *ppid, char *fixed_tensor, char *moving_tensor)
{
    std::cout << "Running DTIREG ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */    
        execl("/raid1e/raid1_restore/codes/my_codes/DTIReg/DTIReg/DTIREG",
              "/raid1e/raid1_restore/codes/my_codes/DTIReg/DTIReg/DTIREG",
              "--fixed_tensor",
              fixed_tensor,     //TARGET (DESIRED  SPACE)
              "--moving_tensor",                                             
              moving_tensor,    //MOVING (ORIGINAL SPACE)
              "--metric",
              "DTITK",
              "--metric",
              "Trace",
              "-t",
              "SyN\[0.75,3,0.5\]",
              "-c",
              "100x100x100",
              "-f",
              "4x2x1",
              "-s",
              "0.5x0.25x0",
              "--final_reorientation",
              "FS",
              (char *)0
        );
        perror("execl error with dtireg... :("); 
        _exit(0);
    }    
};
/*
  DTIREG
*/
int
runExternal_get_xform_files(char *ppid, char *group_folder, char *group_name)
{
    std::cout << "Running Get XFORM files ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */    
        execl("/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/get_xform_files.sh",
              "/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs/get_xform_files.sh",
              group_folder,
              group_name,
              (char *)0
        );
        perror("execl error with get_xform_helper... :("); 
        _exit(0);
    }    
};

int
runExternal_reg_and_combine(char *ppid, char *path, char *grp1, char *grp2)
{
    std::cout << "Running reg and combine ... " << std::endl;
    int status;
    pid_t child = fork();
    if (child == -1) return 1; //Failed
    if (child > 0) { /* I am the parent - wait for the child to finish */
      pid_t pid = waitpid(child, &status, 0);
      if (pid != -1 && WIFEXITED(status)) {
         int low8bits = WEXITSTATUS(status);
         printf("Process %d returned %d\n" , pid, low8bits);
      }
        else {
            printf("NOT SURE WHAT THIS COND IS!\n");
        }
    } else { /* I am the child rawr */    
        execl("/raid1b/STBBapps/DTIREG/bin/reg_and_combine.sh",
              "/raid1b/STBBapps/DTIREG/bin/reg_and_combine.sh",
              path,
              grp1,
              grp2,
              (char *)0
        );
        perror("execl error with get_xform_helper... :("); 
        _exit(0);
    } 


}

/*  
    Generic element printer
*/
template <class T>
inline void 
PRINT_ELEMENTS (const T& coll, const char* optcstr="")
{
    typename T::const_iterator pos;

    std::cout << optcstr;
    for (pos=coll.begin(); pos!=coll.end(); ++pos) 
    {
        std::cout << *pos << ' ';
    }
    std::cout << std::endl;
};

/*  
    Prints all info for each member of a group
*/
void 
print_group_members( group g )
{
	for (std::list<subject>::const_iterator iterator = g.subjects.begin(), end = g.subjects.end(); iterator != end; ++iterator) 
    {
		subject s = *iterator;
		std::cout << "subject #" << s.index << '\n';
		std::cout << "  path: " << s.path << '\n';
		std::cout << "  name: " << s.name << '\n';
		std::cout << "\n";
	}
	std::cout << std::endl;
};

/*  
    Creates list of subjects contained in group file
*/
list<subject>
create_subjects_from_group_file( const char * fname )
{
    list<subject> subs;
	FILE *fr;            /* declare the file pointer */
	char line[255];
	fr = fopen (fname, "rt");
    list<string> lines;
	while(fgets(line, 255, fr) != NULL)
	{
        //lines.push_back(line);
        subject tmp;
        tmp.path = line;
        tmp.name = fname;
        subs.push_back(tmp);
	}
	fclose(fr);
    return subs;
   // return lines;
};

/*  
    Prints a list of strings
*/
void
print_string_list( list<string> s )
{
	for (std::list<string>::const_iterator iterator = s.begin(), end = s.end(); iterator != end; ++iterator) 
    {
        string theString = *iterator;
        std::cout << theString << "\n";
    }
};

/*  
    Prints paired group labels
*/
void 
print_group_pair_labels( std::pair<group,group> thePair )
{
	std::cout << thePair.first.label << "->" << thePair.second.label << "\n";
};

/*  
    Prints a string pair
*/
void
print_string_pair( std::pair<string,string> thePair)
{
    std::cout << thePair.first << "->" << thePair.second << "\n";
};

/*  
    Prints relation pairs from a given atlas
*/
void 
print_atlas_pairs( atlas at )
{
    for (std::list<std::pair<string, string> >::const_iterator iterator = at.relations.begin(), end = at.relations.end(); iterator != end; ++iterator) 
    {
        std::pair<string, string> aPair = *iterator;
        print_string_pair(aPair);
    }
};

/*  
    This will return a list of all var->file mappings in string form
    first arg is of the form: 
      "patients=/path/to/file/containing/patient/nii/files.txt,"...=..."
*/
list<string> 
get_file_mappings( string x )
{
    list<string> rels;
    std::string delimiter = ",";
    size_t pos = 0;
    std::string token;
    while ((pos = x.find(delimiter)) != std::string::npos) 
    {
        token = x.substr(0, pos);
        rels.push_back(token);
        x.erase(0, pos + delimiter.length());
    }
    rels.push_back(x);
    return rels;
};

/*  
    This will return a list of all relations in string form
    i.e. - list<"a->b", "b->c", ...>
*/
list<string>
get_relation_mappings( string x )
{
    list<string> maps;
    std::string delimiter = ",";
    size_t pos = 0;
    std::string token;
    while ((pos = x.find(delimiter)) != std::string::npos) 
    {
        token = x.substr(0, pos);
        maps.push_back(token);
        x.erase(0, pos + delimiter.length());
    }
    maps.push_back(x);
    return maps;
};

/*  
    This will make variable -> path pairs for all groups passed in input
*/
list<std::pair<string, string> >
make_var_path_pairs(list<string> theList)
{
    char tab2[1024];    

    list<std::pair<string,string> > pairList;
    std::pair<string,string> tmpPair;
    std::string first;
    std::string last;   
	for (std::list<string>::const_iterator iterator = theList.begin(), end = theList.end(); iterator != end; ++iterator) 
    {
        int counter = 0;
        string theString = *iterator;
        strncpy(tab2, theString.c_str(), sizeof(tab2));
        tab2[sizeof(tab2) - 1] = 0;
        char * pch;
        pch = strtok (tab2,"=");
        first = pch;
        while (pch != NULL)
        {
            ++counter;            
            if(counter > 1)
            {
                last = pch;
            }
            pch = strtok (NULL, "=");
        }
        tmpPair = std::make_pair(first, last);
        //print_string_pair(tmpPair);
        pairList.push_back(tmpPair);
	}
    return pairList;
};

/*  
    This will make relations from input and returns an atlas
*/
atlas
make_atlas_relations(list<string> theList)
{
    atlas at;
    char tab2[1024];    
    list<std::pair<string,string> > pairList;
    std::pair<string,string> tmpPair;
    std::string first;
    std::string last;   
	for (std::list<string>::const_iterator iterator = theList.begin(), end = theList.end(); iterator != end; ++iterator) 
    {
        int counter = 0;
        string theString = *iterator;
        strncpy(tab2, theString.c_str(), sizeof(tab2));
        tab2[sizeof(tab2) - 1] = 0;
        char * pch;
        pch = strtok (tab2,"->");
        first = pch;
        while (pch != NULL)
        {
            ++counter;            
            if(counter > 1)
            {
                last = pch;
            }
            pch = strtok (NULL, "->");
        }
        tmpPair = std::make_pair(first, last);
        pairList.push_back(tmpPair);
	}
    at.relations = pairList;
    at.label = "Main Atlas";
    return at;
};

/*  
    This will return a group within an atlas having a specified label
*/
group
get_group_with_label(atlas at, string lbl)
{
    list<group> gList = at.groups;
    group found;
    for (std::list<group>::const_iterator iterator = gList.begin(), end = gList.end(); iterator != end; ++iterator) 
    {
        group tmp = *iterator;
        if((tmp.label).compare(lbl) == 0)
        {
            found = tmp;
            return found;
        }
    }
    return found;
};

/*  
    This will create a list of groups, a label and the path to list file containing subject file paths per group
*/
list<group>
create_groups(list<std::pair<string, string> > maps, int makeTemplate)
{
    list<group> gList;
    for (list<std::pair<string, string> >::const_iterator iterator = maps.begin(), end = maps.end(); iterator != end; ++iterator) 
    {
        std::pair<string, string> tPair = *iterator;
        group tmp;
        tmp.label = tPair.first;
        const char * file_path = (tPair.second).c_str();
        std::cout << file_path <<"\n";
        tmp.subjects = create_subjects_from_group_file(file_path); 
        tmp.path = tPair.second;
        
        
        
        if((makeTemplate == 1) && (strcmp(tmp.label.c_str(), "c") == 0))
        {
            std::cout << "Making new template for file: "<<file_path<<std::endl;
            runExternal_DTIREG_Create_Template("1234",
                                          (char *)file_path,
                                          "0",
                                          "/raid1b/STBBapps/DTIREG/bin/"
            );
        }
        else
        {
            std::cout << "Looks like you already have templates, moving on ... " << std::endl;
        }   
        
        gList.push_back(tmp);
    }    
    return gList;
};

list<group>
get_groups(atlas at)
{
    return at.groups;
};



/*  
    This will take a group and print out the paths of subjects
*/
void
print_subject_paths(group grp)
{
    list<subject> sList = grp.subjects;
    for (std::list<subject>::const_iterator iterator = sList.begin(), end = sList.end(); iterator != end; ++iterator) 
    {
        subject tmp = *iterator;
        std::cout << "\t" << tmp.path;
    }
};

/*  
    This will take an atlas and print out the group labels as well as the subject paths within each group
*/
void
print_group_labels(atlas at)
{
    list<group> gList = at.groups;
    for (std::list<group>::const_iterator iterator = gList.begin(), end = gList.end(); iterator != end; ++iterator) 
    {
        group tmp = *iterator;
        std::cout << tmp.label << "\n";
        //print_subject_paths(tmp);
    }
};

/*
    This will take an atlas and print out the group relations
*/
void
print_group_relations(atlas at)
{
    list<std::pair<string, string> > rels = at.relations;
    for (std::list<std::pair<string, string> >::const_iterator iterator = rels.begin(), end = rels.end(); iterator != end; ++iterator) 
    {
        std::pair<string, string> tmp = *iterator;
        print_string_pair(tmp);
    }
};

list<std::pair<string, string> >
generate_intermediate_graphs(atlas at)
{
    list<std::pair<string, string> > rels = at.relations;
    list<std::pair<string, string> > new_rels;
    
    for (std::list<std::pair<string, string> >::const_iterator iterator = rels.begin(), end = rels.end(); iterator != end; ++iterator) 
    {
        std::pair<string, string> tmp = *iterator;
        string lhs = tmp.first;
        string rhs = tmp.second;
        string mid = lhs+"_"+rhs;
        std::pair<string, string> p1 = make_pair(lhs,mid);
        std::pair<string, string> p2 = make_pair(mid,rhs);
        new_rels.push_back(p1);
        new_rels.push_back(p2);
    }
    return new_rels;
};

string
get_final_target(atlas at)
{
    list<std::pair<string, string> > rels = at.relations;
    string lhs;
    string rhs;
    string final_target;    
    for (std::list<std::pair<string, string> >::const_iterator iterator = rels.begin(), end = rels.end(); iterator != end; ++iterator) 
    {
        std::pair<string, string> tmp = *iterator;
        if(lhs.empty() && rhs.empty())
        {
            lhs = tmp.first;
            final_target = rhs = tmp.second;
        }
        else
        {
            lhs = tmp.first;
            rhs = tmp.second;
            if(strcmp(final_target.c_str(), lhs.c_str()) == 0)
            {
                std::cout << "replacing final target "<<final_target<<" with "<<rhs<<"."<<std::endl;
                final_target = rhs;
            }
        }
    }
    std::cout << "final target value is: "<<final_target<<"."<<std::endl;
    return final_target;
};

void
set_final_group_label(atlas at)
{
    group g = get_group_with_label(at, get_final_target(at));
    g.final_target = 1;    
};

//list<std::pair<string, string> >
void
create_transforms(atlas at)
{   
    print_group_relations(at);
    group control = get_group_with_label(at, "c");
    group patient = get_group_with_label(at, "p");
    
    //std::cout << "GROUP CONTROL PATH = " << control.path << "\n\n\n";
    //std::cout << "GROUP PATIENT PATH = " << patient.path << "\n\n\n";
    
    runExternal_get_xform_files("1234",
                                (char *)patient.path.c_str(),
                                (char *)patient.label.c_str());
    runExternal_get_xform_files("1234",
                                (char *)control.path.c_str(),
                                (char *)control.label.c_str());
    
    
   // return NULL;
};

void
reg_and_combine(string ppid, string path, string a, string b)
{

    runExternal_reg_and_combine("1234",
                                (char *)path.c_str(),
                                (char *)a.c_str(),
                                (char *)b.c_str());


}
