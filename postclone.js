var fs = require('fs');
var prompt = require('prompt');
var replace = require('replace');
var rimraf = require('rimraf');
var exec = require('child_process').exec;

var plugin_name,
  class_name,
  app_prefix,
  github_username,
  seed_plugin_name = "nativescript-ng2-yourplugin",
  seed_component = "yourplugin.component",
  seed_directive = "yourplugin.directive",
  seed_pipe = "yourplugin.pipe",
  seed_service = "yourplugin.service",
  seed_class_name = "YourPluginModule",
  seed_github_username = "YourName",
  seed_tns_prefix = "TNSYourPlugin",
  init_git,
  root_path = ".",
  component_path = "./src/app/components",
  directive_path = "./src/app/directives",
  pipe_path = "./src/app/pipes",
  service_path = "./src/app/services"

console.log('NativeScript ng2-Plugin Seed Configuration');
console.log('Shout out to EddyVerbruggen for NativeScript Plugin Seed Configuration script that inspired this work');
prompt.start();
askGithubUsername();

function askGithubUsername() {
    prompt.get({
        name: 'github_username',
        description: 'What is your GitHub username (used for updating package.json)?'
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        if (!result.github_username) {
            return console.log("Dude, the GitHub username is mandatory!");
        }
        github_username = result.github_username;
        askPluginName();
    });
}

function askPluginName() {
    prompt.get({
        name: 'plugin_name',
        description: 'What will be the name of your plugin? Use lowercase characters and dashes only. Example: yourplugin / google-maps / bluetooth'
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        if (!result.plugin_name) {
            return console.log("Dude, the plugin name is mandatory!");
        }
        plugin_name = result.plugin_name;
        generateClassName();
    });
}

function generateClassName() {
    // the classname becomes 'GoogleMaps' when plugin_name is 'google_maps'
    class_name = "";
    var plugin_name_parts = plugin_name.split("-");
    for (var p in plugin_name_parts) {
        var part = plugin_name_parts[p];
        class_name += (part[0].toUpperCase() + part.substr(1));
    }
    console.log('Using ' + class_name + ' as the TypeScript Class name..');
    //renameFiles();
    adjustScripts()
}
function adjustScripts() {
    console.log('Adjusting scripts..');
    fs.readdir(root_path,function(err,rootFiles){
      rootFiles.forEach(file => {
        if(file.endsWith('.json')){
          replace({regex:seed_github_username,replacement:github_username,paths:[file],recursive:true,silent:true})
          replace({regex:seed_plugin_name,replacement:plugin_name,paths:[file],recursive:true,silent:true})
        }else if(file.endsWith('.ts')){
          if(file !== "references.d.ts"){
            console.log(file);
            replace({regex:seed_tns_prefix,replacement:class_name,paths:[file],recursive:true,silent:true})
            replace({regex:seed_class_name,replacement:class_name,paths:[file],recursive:true,silent:true})
            replace({regex:seed_component,replacement:plugin_name + ".component",paths:[file],recursive:true,silent:true})
            replace({regex:seed_directive,replacement:plugin_name + ".directive",paths:[file],recursive:true,silent:true})
            replace({regex:seed_pipe,replacement:plugin_name + ".pipe",paths:[file],recursive:true,silent:true})
            replace({regex:seed_service,replacement:plugin_name + ".service",paths:[file],recursive:true,silent:true})
          }
        }
      });
    });

    fs.readdir(component_path,function(err,componentFiles){
      componentFiles.forEach(file => {
        var pathFile = component_path + "/" + file;
        if(file.endsWith('.ts')){
          replace({regex:seed_tns_prefix,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
        }
      });
    });

    fs.readdir(directive_path,function(err,directiveFiles){
      directiveFiles.forEach(file => {
        var pathFile = directive_path + "/" + file;
        if(file.endsWith('.ts')){
          replace({regex:seed_tns_prefix,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
        }
      });
    });
    fs.readdir(pipe_path,function(err,pipesFiles){
      pipesFiles.forEach(file => {
        var pathFile = pipe_path + "/" + file;
        if(file.endsWith('.ts')){
          replace({regex:seed_tns_prefix,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
        }
      });
    });
    fs.readdir(service_path,function(err,servicesFiles){
      servicesFiles.forEach(file => {
        var pathFile = service_path + "/" + file;
        if(file.endsWith('.ts')){
          replace({regex:seed_tns_prefix,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
        }
      });
    });
    fs.readdir("./src/app",function(err,appRootFiles){
      appRootFiles.forEach(file => {
        var pathFile = "./src/app/"+ file;
        if(file.endsWith('.ts')){
          replace({regex:seed_plugin_name,replacement:plugin_name,paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_tns_prefix,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_class_name,replacement:class_name,paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_component,replacement:plugin_name + ".component",paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_directive,replacement:plugin_name + ".directive",paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_pipe,replacement:plugin_name + ".pipe",paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_service,replacement:plugin_name + ".service",paths:[pathFile],recursive:true,silent:true})
        }
      });
    });
    fs.readdir("./src",function(err,srcRootFiles){
      srcRootFiles.forEach(file => {
        var pathFile = "./src/" + file;
        if(file.endsWith('.json')){
          replace({regex:seed_github_username,replacement:github_username,paths:[pathFile],recursive:true,silent:true})
          replace({regex:seed_plugin_name,replacement:plugin_name,paths:[pathFile],recursive:true,silent:true})
        }
      });
    })
    renameFiles();
}

function renameFiles() {
    console.log('Will now rename some files..');
    fs.readdir(root_path,function(err,rootFiles){
      rootFiles.forEach(file => {
        if (file.indexOf(seed_plugin_name) === 0) {
            var newName = plugin_name + file.substr(file.indexOf("."));
            fs.rename(file, newName);
        }
      });
    });
    fs.readdir(component_path,function(err,componentFiles){
      componentFiles.forEach(file => {
        if(file.indexOf(seed_component) === 0){
          var newName = plugin_name + file.substr(file.indexOf("."));
          var pathFile = component_path + "/" + file;
          var newPath = component_path + "/" + newName;
          fs.rename( pathFile, newPath);
        }
      });
    });

    fs.readdir(directive_path,function(err,directiveFiles){
      directiveFiles.forEach(file => {
        if(file.indexOf(seed_directive) === 0){
          var newName = plugin_name + file.substr(file.indexOf("."));
          var pathFile = directive_path + "/" + file;
          var newPath = directive_path + "/" + newName;
          fs.rename( pathFile, newPath);
        }
      });
    });
    fs.readdir(pipe_path,function(err,pipesFiles){
      pipesFiles.forEach(file => {
        if(file.indexOf(seed_pipe) === 0){
          var newName = plugin_name + file.substr(file.indexOf("."));
          var pathFile = pipe_path + "/" + file;
          var newPath = pipe_path + "/" + newName;
          fs.rename( pathFile, newPath);
        }
      });
    });
    fs.readdir(service_path,function(err,servicesFiles){
      servicesFiles.forEach(file => {
        if(file.indexOf(seed_service) === 0){
          var newName = plugin_name + file.substr(file.indexOf("."));
          var pathFile = service_path + "/" + file;
          var newPath = service_path + "/" + newName;
          fs.rename( pathFile, newPath);
        }
      });
    });   
    initGit();
}

function initGit() {
    prompt.get({
        name: 'init_git',
        description: 'Do you want to init a fresh local git project? If you previously \'git clone\'d this repo that would be wise (y/n)',
        default: 'y'
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        if (result.init_git && result.init_git.toLowerCase() === 'y') {
            rimraf.sync('.git');
            exec('git init -q .', function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                } else {
                    exec("git add '*' '.*'", function(err, stdout, stderr) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
        console.log("Configuration finished! If you're not happy with the result please clone the seed again and rerun this script.");
        console.log("You can now run 'npm run setup' and start cracking!");
    });
}
