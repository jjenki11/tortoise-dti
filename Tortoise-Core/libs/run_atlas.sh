#!/bin/sh

#./make_new_sandbox.sh

#exit


./atlas \
"p=/raid1e/Jeff/final_test_folder/patients/patient_DT_list.txt,\
c=/raid1e/Jeff/final_test_folder/controls/control_DT_list.txt" \
"p->c,c->t" \
< answer_file


#./atlas \
#"c=/raid1e/Jeff/cpp_test_data/controls/control_DT_list.txt,\
#p=/raid1e/Jeff/cpp_test_data/patients/patient_DT_list.txt" \
#"p->c,c->t" "p" \
#< answer_file