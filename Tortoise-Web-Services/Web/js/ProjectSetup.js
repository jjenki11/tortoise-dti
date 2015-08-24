/*
  Project setup page

    - will configure project name
    - will create directories used by project manager
*/


var socket_io;

var ProjectSetup = function(sio)
{
  socket_io = sio;
  return {
  
    modalContent : function(modalDiv) {
    
      var modal = $(modalDiv).append(
        [
          $('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>').append(
            [
              $('<div class="modal-dialog"></div>').append(
                [
                  $('<div class="modal-content"></div>').append(
                    [
                      $('<div class="modal-header"></div>').append(
                        [
                           '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
                           '<h4 class="modal-title" id="myModalLabel">Project Setup</h4>'
                        ]
                      ),
                      $('<div class="modal-body"></div>').append(
                        [
                          'Hello and welcome to the ninjaTortoise DTI project setup!<br><br>',
                          'Please fill out the fields below to get started.<br>',
                          $('<div class="form-group"></div>').append(
                            [
                              '<label>Enter the project name</label>',
                              '<input class="form-control" placeholder="Enter text" id="project_name">'
                            ]
                          ),
                          $('<div class="form-group"></div>').append(
                            [
                              '<label>Enter your email to get notified of progress.</label>',
                              '<input class="form-control" placeholder="you@this.something" id="user_email">'
                            ]
                          )
                        ]
                      ),
                      $('<div class="modal-footer"></div>').append(
                        [
                          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
                          '<button type="button" class="btn btn-primary" id="modalSaveChanges">Save changes</button>'
                        ]
                      )                 
                    ]
                  )
                ]
              ),
            ]
          ),   
        ]
      );
      
      $("#modalSaveChanges").on('click', function(event, ui) {
            socket_io.send('new_project', {
              project_name : $("#project_name").val(),
              user_email   : $("#user_email").val(),
            });
        });
      
      
      return modal;
    }
  };


};
