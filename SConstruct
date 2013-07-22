"""
Fermata build script
Requires: SCons

Based on vexflow SCons script
"""

# Use vexflow_scons helpers
from vexflow_scons import *

# Create debug, opt, and licensed construction environments.
env = default_env.Clone(FERMATA_VERSION = "0.0.2-1", VEX_VERSION = "1.0-pre2")

# Create build directories and attach cleanup handlers to them
mkdir_with_cleanup("build", env)
mkdir_with_cleanup("build/fermata", env)

dbg = env.Clone(
    JS_DEFINES = {
      "Fermata.Debug": "true",
      "Fermata.LogLevel": "4"
    },
    JS_EXTRA_FLAGS = "--formatting=pretty_print",
    JS_COMPILATION_LEVEL = "WHITESPACE_ONLY"
    );

opt = env.Clone(
    FERMATA_BUILD_PREFIX = "prod",
    JS_DEFINES = {
      "Fermata.Debug": "false",
      "Fermata.LogLevel": "4"
    });

node = env.Clone(
    JS_DEFINES = {
      "Fermata.Debug": "true",
      "Fermata.LogLevel": "4"
    },
    JS_EXTRA_FLAGS = "--formatting=pretty_print",
    JS_COMPILATION_LEVEL = "WHITESPACE_ONLY"
    );


# Export construction environments to SConscripts
Export("dbg opt node")

# Build VexFlow
SConscript("src/SConstruct", variant_dir="build/fermata", duplicate=0)

# Copy over tests for distribution
#cpdir_with_cleanup("build/tests", "tests", env)
