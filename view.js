// ---- Define your dialogs  and panels here ----



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
var new_user_permission = define_new_effective_permissions('permissions_panel', true, null);
$('#sidepanel').append(new_user_permission);


//Create a user selection button
// var selection_panel = define_new_user_select_field('new_user', 'Select User', function(selected_user) { 
//     $('#permissions_panel').attr('username', selected_user)
//     $('#permissions_panel').attr('filepath', 'C/presentation_documents/important_file.txt_permicon')
// });



var select_panel = define_new_user_select_field('selector_panel', 'Select User', on_user_change = function(selected_user) {
    $('#permissions_panel').attr('username', selected_user)
    $('#permissions_panel').attr('filepath', '/C/presentation_documents/important_file.txt')
 });
$('#sidepanel').append(select_panel);


//Digalog(ue)
var new_dialog = define_new_dialog('dialog', title='', options = {})


$('.perm_info').click(function(){
    new_dialog.dialog('open');
    console.log($('#permissions_panel').attr('filepath'), $('#permissions_panel').attr('username'), $(this).attr('permission_name'));

    var file_obj = path_to_file[$('#permissions_panel').attr('filepath')];
    var user_obj = all_users[$('#permissions_panel').attr('username')];
    const explanations = allow_user_action(file_obj, user_obj, $(this).attr('permission_name'), explain_why = true);
    var explanation_text = get_explanation_text(explanations);
    $('#dialog').text(explanation_text);

})

//Need to fix GetExplanationText object I think is last thing




// //Pull explanation
// allow_user_action(my_file_obj_var, my_user_obj_var, permission_to_check, explain_why = false);

// var my_file_obj_var = path_to_file['/C/presentation_documents/important_file.txt'];

// var my_user_obj_var = all_users[selected_user];



// var explanation_text = get_explanation_text(explain_why);
// $('#dialog').text(explanation_text) //NEED TO USE THIS TO SELECT THE CORRECT ELEMENT IN THE DIALOG