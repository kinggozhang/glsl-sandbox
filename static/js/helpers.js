

initialize('hqD9IMTNsFSk2LxbiFnBEvCp-gzGzoHsz','ITs4Ni1EiEI5sEcQQ4CBJqpb');

var saveButton, forkButton, parentButton, diffButton,tagInput;
var effect_owner=false;
var original_code='';
var original_version='';

function initialize_compressor(){
	return null;
}

function initialize_helper() {
	window.onhashchange = function() { load_url_code(); };

	if (typeof localStorage !== 'undefined') {
		if ( !localStorage.getItem('glslsandbox_user') ) {
			localStorage.setItem('glslsandbox_user', generate_user_id());
		}
	} else {
		// This fallback shouldn't be used by any browsers that are able to commit code.
		localStorage = { getItem: function(x) { return 'invalid_user'; } };
	}
}

function generate_user_id() {
	return (Math.random()*0x10000000|0).toString(16);
}

function get_user_id() {
	return localStorage.getItem('glslsandbox_user');
}

function am_i_owner() {
	return (effect_owner && effect_owner==get_user_id());
}

function load_url_code(id) {
	if ( id!='') {
		load_code(id);
	} else {
		code.setValue(document.getElementById( 'example' ).text);
		original_code = document.getElementById( 'example' ).text;
	}
}

function add_server_buttons() {
	saveButton = document.createElement( 'button' );
	saveButton.style.visibility = 'hidden';
	saveButton.textContent = 'save';
	saveButton.addEventListener( 'click', save, false );
	toolbar.appendChild( saveButton );

    tagInput = document.createElement('input');
    tagInput.style.visibility = 'visible';
    tagInput.id = 'tags_input';
    toolbar.appendChild(tagInput);

	set_parent_button('visible');
}

function set_save_button(visibility) {
	if(original_code==code.getValue()){
		saveButton.style.visibility = 'hidden';
		tagInput.style.visibility = 'hidden';
    }
	else{
		saveButton.style.visibility = visibility;
		tagInput.style.visibility = visibility;
    }
}

function set_parent_button(visibility) {
	if(original_version=='') {
		//parentButton.style.visibility = 'hidden';
		//diffButton.style.visibility = 'hidden';
	} else {
		//parentButton.style.visibility = visibility;
		//diffButton.style.visibility = visibility;
	}
}


function get_img( width, height ) {
	canvas.width = width;
	canvas.height = height;
	parameters.screenWidth = width;
	parameters.screenHeight = height;

	gl.viewport( 0, 0, width, height );
	createRenderTargets();
	resetSurface();

	render();

	img=canvas.toDataURL('image/png');

	onWindowResize();

	return img;
}

function save() {
	img=get_img(200, 100);

	data={
		"code": code.getValue(),
		"image": img,
		"user": get_user_id()
	}

	loc='/e';

	if(am_i_owner())
		data["code_id"]=window.location.hash.substr(1);
	else {
		data["parent"]=window.location.hash.substr(1);
	}
  var data= {"tags":document.getElementById('tags_input').value,"snapshot":img,"code":code.getValue(), "author":''};
  createTableItem('glsl', data, 
				function(table, obj)
				{
					alert("新文章发表成功");
				},
				function(table, error)
				{
				    alert("发生错误:" + error.message);
				},[],[currentUser().id]);    
}

function load_code(id) {
	if (gl) {
		compileButton.title = '';
		compileButton.style.color = '#ffff00';
		compileButton.textContent = 'Loading...';
	}
	set_save_button('hidden');
	set_parent_button('hidden');
    var query = new AV.Query('glsl');
    query.get(id).then(function (tobj) {
	
		compileOnChangeCode = false;  // Prevent compile timer start
		code.setValue(tobj.get('code'));
		original_code=code.getValue();

		resetSurface();
		compile();
		compileOnChangeCode = true;
	});
}

// dummy functions

function setURL(fragment) {
}

