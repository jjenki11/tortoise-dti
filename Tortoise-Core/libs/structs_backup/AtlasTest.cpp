
#include <list>
#include <algorithm>
#include <sstream>
#include <iostream>
#include <string>
#include <stdio.h>
#include <cstring>

using namespace std;

/*  
    Subject structure
*/
struct 
subject {
	int index;
	string name;
	string path;
};

/*  
    Group structure
*/
struct 
group {
	list<subject> subjects;
	string label;
};

/*  
    Atlas structure
*/
struct 
atlas {
	// list<std::pair<group, group> > groupRelations; // TBD
    list<group> groups;
    list<std::pair<string, string> > relations;
    string label;
};

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
	int idx = 0;
	for (std::list<subject>::const_iterator iterator = g.subjects.begin(), end = g.subjects.end(); iterator != end; ++iterator) 
    {
		idx++;
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
	int n;
	long elapsed_seconds;
	char line[255];
	fr = fopen (fname, "rt");
	int i = 0;
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
	int idx = 0;
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
	int idx = 0;
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
create_groups(list<std::pair<string, string> > maps)
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
        gList.push_back(tmp);
    }    
    return gList;
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
        std::cout << tmp.path;
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
        print_subject_paths(tmp);
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

/*  
    Main function will read cmd line and do necessary setup
*/
int 
main(int argc, char **argv)
{
    string arg1 = argv[1];
    string arg2 = argv[2];
    string arg3 = argv[3];
    
    list<string> maps = get_file_mappings(arg1);
    print_string_list(maps);
    list<std::pair<string, string> > var_path_maps = make_var_path_pairs(maps);
    std::cout << "Created Variable to path maps \n";  
    std::cout << "Created Groups from the following files:\n";

    list<string> rels = get_relation_mappings(arg2);

    atlas a1 = make_atlas_relations(rels);

    a1.groups = create_groups( var_path_maps );  
    
    std::cout << "\nAssigned group list to atlas\n";
    print_group_labels( a1 );

    std:: cout << "\nAssigned group relations in atlas \n";
    print_group_relations( a1 );

    // OPTIONAL -> this is just usage for how to get a group given the atlas and a label as the args
    group p2 = get_group_with_label(a1, arg3);
    std::cout << "GROUP has the label: " << p2.label << std::endl;    
    std::cout << "Subjects of group " << p2.label << ":" << std::endl;
    print_subject_paths(p2);
};


