pkg_name=mapvue
pkg_origin=uaf-rcs
pkg_version="0.1.0"
pkg_dep=(core/node)

do_build() {

  # By default, we're in the directory in which the Studio was entered
  # (in this case, presumably the project root), so we can run commands
  # as though we were in that same directory. By the time we reach this
  # callback, `npm` will have been installed for us.
  npm install
}

do_install() {

  # The `pkg_prefix` variable contains the fully-qualified Studio-relative path to
  # a specific build run (e.g., /hab/pkgs/<YOUR_ORIGIN>/sample-node-app/1.1.0/20180620174915).
  # In this callback, we copy the files that our application requires at runtime
  # into that directory, and once this step completes, Habitat will take
  # over to produce the finished package as a .hart file.
  local app_path="$pkg_prefix/src"
  mkdir -p $app_path

  cp -R \
    node_modules \
    layer_configurations \
    static \
    tmps \
    package.json \
    $app_path
}

