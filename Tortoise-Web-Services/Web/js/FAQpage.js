/*
    This is the FAQ page api
      usage:        
        var x = new FAQpage();        
        var cont = x.content();
     cont will now be populated with the entire HTML for the FAQ page and can be used modularly to insert into any div
*/
var FAQpage = function()
{
    var qaList = [    
        {
            question : 'I would like to contribute information to these wiki pages. How can I edit the wiki?',
            answer   : 'If you are interested in contributing to these wiki pages, please contact us at <a href="mailto:tortoisedti@gmail.org?Subject=Contribute%20To%20Tortoise" target="_top">tortoisedti@gmail.org</a> in order to create an account for you.',
            index    : 1
        },
        {
            question : 'I get the following error message (or something similar) in DIFF_PREP. <br><pre><code>% HISTOGRAM: Illegal binsize or max/min.<br>% Execution halted at: OTSU </code> </pre>\
                        What does this mean?',
            answer   : 'This occurs when the automatic noise computation algorithm encounters an image (usually the structural target image) which has a zero background value, or an unexpected range of values. \
                        There are 3 possible solutions to this problem:\
                        <ul>\
                            <li>\
                                If this is done on purpose, such as you decide to use a masked structural target (not recommended!), you will need to enter a reasonable noise value using the optional \
                                settings in DIFF_PREP for the background noise padding that is performed in the code.\
                            </li>\
                            <li>\
                                If you have manipulated your structural target image (such as ACPC re-orientation and skull attenuation) and this has resulted in zero values in the background, you will \
                                need to make sure that your structural image is being stored as floating point values. When the image stores either integer or short values, when they become small they \
                                get rounded to zero and cause this problem. Click here for instructions on how to change your image\'s data type to floating point using mipav.\
                            </li>\
                            <li>\
                                If your DWI data has an usual scaling factor applied, for example, you DWI images range in intensity from only 0 - 1, then this may occur. Use the "scale signal factor" \
                                setting in the registration settings file to scale your DWI images to a reasonable range.\
                            </li>\
                        </ul>',
            index   : 2
        },
        {
            question : 'I tried to run DIFF_PREP starting at step 5 and stopping at step 5 (i.e. run step 5 only) and it gave a "No such file or directory" error message regarding file ....list_step4/...',
            answer   : 'Some files from step 4 are deleted at the end in order to save disk space. These files are required for step 5 to run correctly. You will need to run this starting at step 4 and \
                        stopping at step 5. This should only add a couple of minutes to the processing time.',
            index   : 3
        },
        {
            question : 'I get an error message in the Import side of DIFF_PREP containing the words "GET_DIRECTION". What is wrong?',
            answer   : 'Likely the number of gradient directions acquired and the number of lines in your gradient file are not consistent. Please check that your gradient file is correct.',
            index    : 4
        },
        {
            question : 'What is the output naming convention of the software?',
            answer   : 'The naming convention is simple. Your original listfile will be named based on the data directory put into the Import routine. For example, if your directory is subject_1_data, then your list file will be subject_1_data.list. The output names reflect the following things.'+
                        '<ul>'+
                            '<li>'+
                                'subject_1_data_up.list: _up reflects the fact that you have selected the upsampling option in the registration settings file. This listfile contains data that is upsampled according to your settings.'+
                            '</li>'+
                            '<li>'+
                                'subject_1_data_up_rpd.list: _up (see 1 above), _rpd means that the data has been run through the motion and eddy current distortion correction steps. In this example, the data has first been upsampled, then corrected.'+
                            '<li>'+
                                'subject_1_data_DMC.list: _DMC is the final results of the registration code.'+
                            '</li>'+
                        '</ul>',
            index    : 5
        },
        {
            question : 'I do not have files with _up, or _up_rpd in my procbase. Where are they?',
            answer   : 'If you do not have the above files, but you do have _DMC files, then check the registration settings file that you used. If "keep intermediate files" is set to off, then it will delete the _up and _up_rpd files after completing the registration procedures.',
            index    : 6
        },
        {
            question : 'I tried to run the Import routine, but nothing happened. What is wrong?',
            answer   : 'Please check that you have write permissions in the directory where the data directory resides. The import routine is trying to write a parallel directory to your data directory, and probably cannot save.',
            index    : 7
        },
        {
            question : 'I get the following error in DIFF_PREP/DIFF_CALC. <br><pre><code>% Program caused arithmetic error: Floating underflow\n% Program caused arithmetic error: Floating illegal operand</code></pre>What does that mean?',
            answer   : 'This is normal and can happen in both DIFF_PREP and DIFF_CALC. It is a preference of IDL to keep these statments in. It will not affect the results or functionality of the software in any way.',
            index    : 8
        },
        {
            question : ' I get the following error (or something similar). <br><pre><code> &lt;ObjHeapVar167174&gt;<br>        STRUCT    = -> IDLJAVAOBJECT$CGK_SNIE Array[1]</code></pre>What does that mean?',
            answer   : 'This is a known issue with part of the code written in java. It does not interfere with the normal functionality of the software or the results of your registration in any way.',
            index    : 9
        },
        {
            question : 'What interpolation method should I use for upsampling the data?',
            answer   : 'The bicubic interpolation method is both visually more appealing and theoretically a better method.  This is being more thoroughly investigated.',
            index    : 10
        },
        {
            question : 'What are the various start/stop steps in the registration settings file?',
            answer   : 'Start at 0: do everything starting from the beginning<br>'+
                       'Start at 3: assumes that motion and eddy correction are done, and starts with the b-spline computation<br>'+
                       'Start at 4: assumes same as above, and that the b-spline deformation has been calculated, and starts with applying that to the DWIs<br>'+
                       'Start at 5: assumes all steps have been computed for corrections, and starts only with the final reorientation to the structural space.<br><br>'+
                       'Stop at step 2: will do ONLY motion and eddy corrections<br>'+
                       'Stop at step 3: will also calculate the b-spline deformation without applying it to the DWIs<br>'+
                       'Stop at step 4: will do all of the above and also apply the b-spline deformation to the DWIs<br>'+
                       'Stop at step 5: do everything'+
                       '<pre><b>Comment:</b><br>'+
                       'The Start at/Stop at settings are only intended as a tool in the case that something goes wrong. '+
                       'For example: your computer crashes during the b-spline correction and you do not want to have to repeat the motion and eddy distortion corrections.<br><br>'+
                       'For flexibility such as "don\'t do the b-spline" or "don\'t do the motion and eddy" use the "Perform" options in the registration settings file',
            index    : 11
        },
        {
            question : 'What is step 1?',
            answer   : 'For legacy reasons, there is currently no step 1. What was originally known as step 1 has been integrated into step 0.',
            index    : 12
        },
        {
            question : 'What is the difference between diffprep.sav and diffprep_gui.sav?',
            answer   : 'diffprep_gui.sav is the main program for DIFF_PREP. diffprep.sav is a command line only version which can only be run with a full idl license. '+
                       'If you are using the VM, you must use diffprep_gui.sav, or prepvm which is pre-packaged with the IDL VM.',
            index    : 13
        },
        {
            question : 'The software crashed, and now it doesn\'t function normally, what do I do?',
            answer   : 'If the software ever crashes, it is STRONGLY ADVISED that you quit DIFF_PREP or DIFF_CALC, and begin again with a fresh copy. '+
                       'This will assure that all variables and other information that may be stored in the cache are properly removed.',
            index    : 14
        },
        {
            question : 'I get a permissions error to do with IDL which says something like: <br>'+
                       '/install_dir/TORTOISE_V1.0.3/DIFF_PREP/diffprep_main/../../idl71/bin/bin.linux.x86/idl: error while loading shared libraries: '+
                       '/install_dir/TORTOISE_V1.0.3/DIFF_PREP/diffprep_main/../../idl71/bin/bin.linux.x86/libidl.so.7.1: cannot restore segment prot after reloc: Permission denied',
            answer   : 'This is a permissions issue with SELinux. To get around this you have to change the system settings to permissive or by changing the security settings on the idl shared object library files<br>'+
                       'Do this as root in the directory where these files are:<br>'+
                       '   chcon -t texrel_shlib_t *.so<br><pre>'+
                       'Thanks to Daniel Glen for this fix</pre>',
            index    : 15
        },
        {
            question : 'I get an error about widgets that says something like:<br><pre><code>'+
                       '% WIDGET_CONTROL: Invalid widget identifier: 4.<br>'+
                       '     % Execution halted at:  TOSTATUSWINDOW<br>'+
                       '     %                       DIFFPREP_GUI_EVENT<br>'+
                       '     %                       XMANAGER_EVLOOP_STANDARD<br>'+
                       '     %                       XMANAGER       <br>'+
                       '     %                       DIFFPREP_GUI<br>'+
                       '     %                       IDLRTMAIN<br>'+
                       '     %                       $MAIN$  ',
            answer   : 'IDL needs to keep track of the different widget windows that are opened when running the software. '+
                       'If you close any of the widgets using the "X" at the top corner of any of the windows, it may produce this error. '+
                       'Please always use the "quit" or "done" buttons in the different windows in order to close them properly.',
            index    : 16
        },
        {
            question : 'What quantities are calculated during the tensor fitting?',
            answer   : 'See the page on the <a href="#">roi utilities</a> for DIFF_CALC',
            index    : 17
        },
        {
            question : 'Siemens Mosaic import cuts my images into the wrong number of slices, resulting in partial brain only in each axial slice.',
            answer   : 'This is specifically caused by the software not being able to read the correct FOV, and is most likely to occur in datasets where zero filling was applied at the scanner. '+
                       'Normally, this information is provided in a private dicom field (0051,100B). If that tag is missing, the software will not be able to import your data properly. In '+
                       'TORTOISE V1.1.1, a user has discovered that even when that private tag is present, mosaic data is not being properly imported into TORTOISE. We have identified this as '+
                       'a problem with IDL V8.0 and are working to correct the problem.',
            index    : 18
        },
        {
            question : 'FSL 4D NIFTI import option in DIFF_PREP gives me an error message "NIFTI file folder does not contain a bvecs file as outputted by FSL" but there is a bvec file in the data directory. '+
                       'What is the problem?',
            answer   : 'The FSL 4D NIFTI import option requires that the bvalues and bvectors files be named exactly as they would be for running FSL from the command line. Check that these files are named '+
                       'exactly "bvecs" and "bvals". The dcm2nii from MRICron may output these files as your_file_name.bvecs and your_file_name.bvals. These files need to be renamed to bvecs and bvals for '+
                       'import to TORTOISE.',
            index    : 19
        },
        {
            question : 'I get the following error message. <br><pre><code>/TORTOISE_linux_withIDL_V1.1.1/DIFF_PREP/diffprep_main/../../idl80/bin/bin.linux.x86/idl: error while loading shared libraries:<br>'+
                       '/TORTOISE_linux_withIDL_V1.1.1/DIFF_PREP/diffprep_main/../../idl80/bin/bin.linux.x86/libidl.so.8.0: cannot restore segment prot after reloc: Permission denied</code></pre>How do I fix this?',
            answer   : 'Follow the instructions from <a href="http://www.cubrid.org/wiki_tutorials/entry/cannot-restore-segment-prot-after-reloc-permission-denied">this link</a>.<br><pre>Thanks to user M.S. for this fix.</pre>',
            index    : 20
        },
        {
            question : 'There are "holes" in my tensor/FA maps. Why? What can I do to remove them?',
            answer   : 'This depends on whether the holes are in your TENSOR or in just the ANISTROPY maps. See the 2 solutions below.',
            index    : 21
        },
        {
            question : 'There are holes in the TENSOR, which results in holes in all tensor derive metric maps such as FA, TR, etc.',
            answer   : 'If there is a single "zero" value in any one of your DWI\'s, the software default used to be to mask out that point entirely. Two additional options exist, \
                        one which is to exclude only the zero data points from the fitting, or the second (which should now be set as the default option) is to use a median neighborhood \
                        filtering to fill the zero points. This can be set in your configuration file, which lives in a directory called DIFF_CALC_WORK, and resides in your home directory \
                        (i.e. /user/home/DIFF_CALC_WORK/default_configfile.xml). Simply copy and paste the following lines into your configuration file, save the configuration file, and \
                        open a new instance of DIFF_CALC so that the variables are set appropriately to the new configuration file.<br><br>\
                        <pre><code>&lt;!-- mask zero values from tensor fitting? 0 = exclude zero points from fitting, 1=mask out zero points --&gt;<br>&lt;!-- 2 = use median filter --&gt;'+
                        '<br>&lt;mask_zero_point&gt;<br>   2<br>&lt;/mask_zero_point&gt;</code></pre>',
            index    : 22
        },
        {
            question : 'There are holes only in the FRACTIONAL ANISOTROPY or other ANISOTROPY maps, what should I do to remove them?',
            answer   : 'We apply masking that is intended to identify voxels with artifactual anisotropy due to flow artifacts, which are known to occur in the CSF and can result in \
                        artifactual FA values. The flow artifact masking we do does not actually create "holes" in the tensor data, but sets the diffusivity to that of CSF (i.e. free \
                        water at 37 degrees) which has an ideal anisotropy value of zero. Thus, if you look at the Trace (TR) map for instance, you should not see any holes. However, \
                        you may see some zero values in the anisotropy maps. If you take a look at the _MF mask image in your _SAVE directory, it will show you the points where this \
                        flow artifact masking is applied.<br><br>We realize that having zero values in the anisotropy maps can be problematic for certain things, such as the erosion \
                        of masks in FSL\'s pipeline. For a future release of our software, we intend to implement a slight im-balance in the diffusivity that is set for those artifactual \
                        data points so that instead of a zero value, there will now be extremely low values in the anisotropy maps, which should prevent some unwanted behaviour in other \
                        software packages.<br><br>If you require to remove these zero values from your anistoropy maps before the next software release, we recommend using an image \
                        processing software package such as MIPAV to replace the zero voxel values with a very low value (something like 0.00001) to prevent excessive erosion of images \
                        during masking, or other issues that may arise due to zero values in your anisotropy images.<pre>Thanks to user S.Z. for bringing these issues to our attention</pre>',
            index    : 23
        },
        {
            question : 'On macintosh computer, when working with the ROI tool in DIFF_CALC the mouse cursor does not respond or draws ROI\'s at unintended locations on the image. Why?',
            answer   : 'It is important to setup X11 before using TORTOISE on a macintosh computer. To setup, go to X11 preferences and select the Windows tab. Make sure that the \
                       "Click through Inactive windows" box is checked. Then open a new X11 window and start your DIFF_CALC session. This will fix the ROI issue.',
            index    : 24
        },
    ];    
    
    
    function createFAQItem(question, answer, index)
    {
        var obj = $("<div></div>");
        
        var div1 = $("<div class='panel panel-default'></div>");
        var hd  = $("<div class='panel-heading'></div>");
        var title = $("<div class='panel-title'></div>");
        var ahr   = $("<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+index+"'><span class='glyphicon glyphicon-question-sign' aria-hidden='true'></span><br>  "+question+"</a>");
        
        var div2 = $("<div id='collapse"+index+"' class='panel-collapse collapse'></div>");
        var d2bod = $("<div class='panel-body'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span><br>  "+answer+"</div>");
        
        obj.append([            
            div1.append([
                hd.append([
                    title.append([
                        ahr
                    ])
                ])
            ]),            
            div2.append([
                d2bod
            ])
        ]);        
        return obj;        
    };

    return {
    
        content : function() {            
            var jumbo = $('<div class="jumbotron"></div>');
            var cntnr = $('<div class="container"></div>');
            var headr = $('<div class="page-header "></div>');
            var h1c   = $('<h1 class="text-center">FAQ <br> <small> You have questions, we have answers. </small> </h1>');
            var enten = $('<div class="well well-sm entete"></div>');
            
            var html = $("<div></div>");
            html.append([            
                jumbo.append(
                    cntnr.append(
                        headr.append([
                            h1c,
                            enten
                        ])
                    )
                ),
                '<br><br>'                
            ]);
            
            var obj = $("<div></div>");            
            var faqs = $("<div></div>");
            
            for(var i=0; i < qaList.length; i++)
            {
                faqs.append(createFAQItem(qaList[i].question, qaList[i].answer, qaList[i].index))
            }
            
            obj.append([
                html,
                $('<div class="panel-group" id="accordion">Click on the question rows below to reveal the answer!</div>').append([
                    faqs
                ])
            ]);
            
            return obj;
        },
        createFAQItem : createFAQItem,
    };
    
};
