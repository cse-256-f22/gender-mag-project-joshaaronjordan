// ---- Define your dialogs  and panels here ----
document.querySelector('body').addEventListener('click', event => {
    if (event.target.matches('#mturk-top-banner-back')) {
event.preventDefault();
        alert('This is a hint.')
    }
});


// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 



/*
Studio code
*/




let permissions_panel = define_new_effective_permissions("perm_panel", true);
$('#sidepanel').append(permissions_panel)

let user_select_button = define_new_user_select_field('new_user', "Select", function(selected_user) {
    $('#perm_panel').attr('username', selected_user)
 })
$('#sidepanel').append(user_select_button)
$('#perm_panel').attr('filepath', '/C/presentation_documents/important_file.txt')
let new_blank_dialog = define_new_dialog('dialog', 'Dialog Title');
$('.perm_info').click(function(){

    console.log('clicked!')
    console.log($('#perm_panel').attr('filepath'), $('#perm_panel').attr('username'), $(this).attr('permission_name') )
    $( "#dialog" ).dialog( "open" );
    let file = path_to_file[$('#perm_panel').attr('filepath')]
    let user = all_users[$('#perm_panel').attr('username')]
    let explanation =  allow_user_action(file, user, $(this).attr('permission_name'), true)
    let exp_string = get_explanation_text(explanation)
    $( "#dialog" ).text(exp_string)

})




//add file select button to selector panel
//var file_seletor
var file_select_panel = define_new_file_select_field('file_selector', 'Select File', on_file_change = function(selected_file){
    
    $('#permissions_panel').attr('filepath', selected_file)
    
});
$('#sidepanel').append(file_select_panel);

$('#filestructure').append("<button id = \"revert_changes\" onClick=\"window.location.href=window.location.href\">Reset Changes</button>")

// //Digalog(ue)
// var new_dialog = define_new_dialog('dialog', title='', options = {})


// $('.perm_info').click(function(){
//     new_dialog.dialog('open');
//     console.log($('#permissions_panel').attr('filepath'), $('#permissions_panel').attr('username'), $(this).attr('permission_name'));

//     var file_obj = path_to_file[$('#permissions_panel').attr('filepath')];
//     var user_obj = all_users[$('#permissions_panel').attr('username')];
//     const explanations = allow_user_action(file_obj, user_obj, $(this).attr('permission_name'), explain_why = true);
//     var explanation_text = get_explanation_text(explanations);
//     $('#dialog').text(explanation_text);

// })

$('#filestructure').append("<div id = \"explanation_box\"> <h3>Welcome to your task, in order to change file permissions, click on the lock icons, select \
a user to change permissions for, and change the permissions with the check boxes below. Remember, a user can inherit permissions from parent permission specifications. <br><br>It may be helpful to use the user selector or file selector on the right side of the screen --> <br>\
If you are still struggling to effectively change the permission, please look at the \"Advanced\" when you click the lock icon.</h3> </div>")


//Need to fix GetExplanationText object I think is last thing




// //Pull explanation
// allow_user_action(my_file_obj_var, my_user_obj_var, permission_to_check, explain_why = false);

// var my_file_obj_var = path_to_file['/C/presentation_documents/important_file.txt'];

// var my_user_obj_var = all_users[selected_user];



// var explanation_text = get_explanation_text(explain_why);
// $('#dialog').text(explanation_text) //NEED TO USE THIS TO SELECT THE CORRECT ELEMENT IN THE DIALOG