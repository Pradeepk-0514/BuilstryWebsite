#!/usr/bin/env python3
"""Create the Builstry 3D journey asset pack from editable Blender geometry.

Run from the project root with:
  blender --background --python tools/build_journey_scene.py

The exported GLB keeps each milestone's meshes beneath a named Empty so React
Three Fiber can reflow each prop group for landscape, tablet and portrait layouts.
"""
from __future__ import annotations

import array
import math
import random
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

ROOT = Path.cwd()
OUT = ROOT / "public" / "assets" / "journey"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(17)

# Reset the default scene and orphaned assets for a deterministic build.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for collection in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
    for block in list(collection):
        if block.users == 0:
            collection.remove(block)


def linear_hex(value: str):
    value = value.lstrip("#")
    rgb = [int(value[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)


def material(name, color, *, metallic=0.0, roughness=0.32, alpha=1.0, transmission=0.0, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*linear_hex(color), alpha)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*linear_hex(color), alpha)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Alpha"].default_value = alpha
    if "Transmission" in bsdf.inputs:
        bsdf.inputs["Transmission"].default_value = transmission
    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = 1.34
    if emission and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*linear_hex(emission), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    elif emission and "Emission" in bsdf.inputs:
        bsdf.inputs["Emission"].default_value = (*linear_hex(emission), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    if alpha < 0.999:
        try:
            mat.blend_method = "BLEND"
        except (AttributeError, TypeError):
            pass
        try:
            mat.show_transparent_back = False
        except AttributeError:
            pass
    return mat


ice = material("Glacier glass | pearl", "E9F0FF", metallic=0.18, roughness=0.18, alpha=0.74, transmission=0.1)
ice_clear = material("Glacier glass | clear", "F8F7FF", metallic=0.08, roughness=0.12, alpha=0.43, transmission=0.28)
pearl = material("Warm pearl", "FFF9FD", metallic=0.12, roughness=0.19)
rose = material("Signal rose", "ED3B91", metallic=0.16, roughness=0.2, emission="F2318B", emission_strength=0.32)
rose_soft = material("Rose quartz", "F19ACC", metallic=0.12, roughness=0.2, alpha=0.78, transmission=0.08)
lilac = material("Lavender prism", "AF9AE9", metallic=0.18, roughness=0.24, alpha=0.78, transmission=0.12)
lilac_clear = material("Lavender crystal", "D3C8FF", metallic=0.12, roughness=0.18, alpha=0.5, transmission=0.16)
navy = material("Midnight blue", "344F69", metallic=0.25, roughness=0.27)


def parent_local(obj, parent, location, rotation=(0, 0, 0), scale=(1, 1, 1)):
    obj.parent = parent
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.location = Vector(location)
    obj.rotation_euler = rotation
    obj.scale = scale
    return obj


def bevel(obj, amount=0.035, segments=3):
    mod = obj.modifiers.new("Soft machined edges", "BEVEL")
    mod.width = amount
    mod.segments = segments
    mod.limit_method = "ANGLE"
    return obj


def cube(parent, name, pos, dims, mat, *, rotation=(0, 0, 0), radius=0.035):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    parent_local(obj, parent, pos, rotation, dims)
    obj.data.materials.append(mat)
    if radius:
        bevel(obj, min(radius, min(dims) * 0.14), 3)
    return obj


def cylinder(parent, name, pos, radius, depth, mat, *, scale_xy=(1.0, 1.0), vertices=64, bevel_width=0.018):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    parent_local(obj, parent, pos, scale=(scale_xy[0], scale_xy[1], 1.0))
    obj.data.materials.append(mat)
    if bevel_width:
        bevel(obj, bevel_width, 3)
    return obj


def sphere(parent, name, pos, radius, mat, *, scale=(1, 1, 1), segments=32, rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=radius, location=(0, 0, 0))
    obj = bpy.context.object
    obj.name = name
    parent_local(obj, parent, pos, scale=scale)
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def torus(parent, name, pos, major, minor, mat, *, rotation=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_segments=64, minor_segments=10, location=(0, 0, 0), major_radius=major, minor_radius=minor)
    obj = bpy.context.object
    obj.name = name
    parent_local(obj, parent, pos, rotation, scale)
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def crystal(parent, name, pos, radius, height, mat, *, lean=0.0):
    # Faceted five-point ice shard, with a separately tinted face for a subtle gradient.
    verts = [(-radius, -radius * .62, 0), (radius, -radius * .62, 0), (radius, radius * .62, 0), (-radius, radius * .62, 0), (lean, 0, height)]
    faces = [(0, 3, 2, 1), (0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)]
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.materials.append(ice_clear)
    mesh.materials.append(rose_soft)
    mesh.polygons[0].material_index = 1
    mesh.polygons[2].material_index = 2
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    parent_local(obj, parent, pos)
    return obj


def anchor(year, position):
    obj = bpy.data.objects.new("Journey_" + year, None)
    bpy.context.collection.objects.link(obj)
    obj.empty_display_type = "SPHERE"
    obj.empty_display_size = 0.18
    obj.location = position
    return obj


def platform(group, index, width=1.25):
    cylinder(group, f"{index} | floating plinth", (0, 0, 0.02), 1.0, 0.12, ice, scale_xy=(width, .62), bevel_width=.025)
    cylinder(group, f"{index} | opal top", (0, 0, 0.091), .89, .022, ice_clear, scale_xy=(width, .62), bevel_width=.008)
    torus(group, f"{index} | rose inlay", (0, 0, 0.105), .84, .014, rose_soft, scale=(width, .62, 1))
    # Translucent layered edge reads as suspended resin rather than a flat UI marker.
    cylinder(group, f"{index} | lower shadow lip", (0, 0, -.052), .96, .035, lilac_clear, scale_xy=(width * .98, .60), bevel_width=.01)


def build_mountain(group, prefix, center=(0, 0, 0.12), scale=1.0, summit=False):
    base_x, base_y, base_z = center
    specs = [(-.43, .62, .80), (-.1, .58, 1.14), (.34, .66, .88), (.56, .48, .48)]
    if summit:
        specs = [(-.58, .74, 1.02), (-.18, .72, 1.48), (.28, .8, 1.20), (.66, .60, .82), (.85, .48, .54)]
    for i, (dx, width, height) in enumerate(specs):
        material_for_peak = (lilac if i % 2 == 0 else rose_soft) if (summit and i == 0) else (ice if i % 2 == 0 else lilac_clear)
        crystal(group, f"{prefix} | faceted summit {i + 1}", (base_x + dx * scale, base_y + (i % 2 - .5) * .17 * scale, base_z), width * .62 * scale, height * scale, material_for_peak, lean=((-1) ** i) * .13 * scale)
    # A small glowing snowline catches the key light.
    torus(group, f"{prefix} | snowline halo", (base_x, base_y, base_z + .06 * scale), .66 * scale, .012 * scale, lilac_clear, scale=(1.6, .68, 1))


def create_studio_hdr():
    width, height = 1024, 512
    image = bpy.data.images.new("Builstry | Softbox HDRI", width=width, height=height, alpha=False, float_buffer=True)
    pixels = array.array("f")
    for y in range(height):
        v = y / max(height - 1, 1)
        # Soft cool floor-to-sky gradient, with warm rose and lavender softboxes.
        t = max(0.0, min(1.0, v))
        base = (0.44 + .10 * (1 - t), 0.49 + .12 * (1 - t), 0.62 + .14 * (1 - t))
        for x in range(width):
            u = x / width
            def spot(cx, cy, sx, sy):
                dx = min(abs(u - cx), 1 - abs(u - cx)) / sx
                dy = abs(t - cy) / sy
                return math.exp(-(dx * dx + dy * dy) * 2.6)
            white = 3.1 * spot(.19, .37, .075, .12) + 2.1 * spot(.70, .55, .10, .16)
            pink = 1.15 * spot(.88, .34, .06, .14)
            blue = .95 * spot(.48, .78, .12, .12)
            pixels.extend((base[0] + white + pink, base[1] + white * .97 + pink * .28 + blue * .22, base[2] + white + pink * .68 + blue, 1.0))
    image.pixels.foreach_set(pixels)
    image.filepath_raw = str(OUT / "builstry-studio.hdr")
    image.file_format = "HDR"
    image.save()
    return image


# Place source groups in a camera-framed landscape; runtime repositions them responsively.
wide = [(-8.15, -2.88, 0), (-5.56, -2.02, 0), (-2.95, -1.20, 0), (-.35, -.39, 0), (2.26, .43, 0), (4.88, 1.24, 0), (7.50, 2.05, 0)]

for index, (year, pos) in enumerate(zip(("2018", "2019", "2020", "2021", "2022", "2023", "2024"), wide), start=1):
    group = anchor(year, pos)
    platform(group, f"{year} | platform", width=1.06 if index < 7 else 1.16)
    # Small luminous route socket makes the journey visibly pass through each stop.
    sphere(group, f"{year} | path node", (0, -.04, .17), .075, rose, segments=24, rings=16)
    if year == "2018":
        sphere(group, "2018 | curiosity pearl", (0, 0, .63), .39, rose_soft, scale=(1, 1, .94))
        torus(group, "2018 | orbit one", (0, 0, .64), .60, .018, rose, rotation=(math.radians(68), 0, math.radians(-8)), scale=(1.12, .8, 1))
        torus(group, "2018 | orbit two", (0, 0, .64), .50, .011, lilac, rotation=(math.radians(34), math.radians(18), math.radians(18)), scale=(1.2, .75, 1))
        sphere(group, "2018 | glint", (-.17, -.18, .90), .052, pearl, segments=16, rings=10)
        for i, p in enumerate([(-.82, .14, .68), (.76, .18, .76), (-.55, .28, 1.0)]):
            sphere(group, f"2018 | curiosity bubble {i + 1}", p, .105 if i != 2 else .065, lilac_clear if i % 2 else rose_soft, segments=20, rings=12)
    elif year == "2019":
        build_mountain(group, "2019 | obstacle terrain", center=(0, 0, .13), scale=.83)
        sphere(group, "2019 | waypoint", (.68, -.18, .39), .11, rose, segments=20, rings=12)
        crystal(group, "2019 | small wayfinder", (-.76, .12, .19), .22, .53, rose_soft, lean=.06)
    elif year == "2020":
        # Disc-like stepped blocks echo the reference's translucent building layers.
        for i, (w, z, c) in enumerate(((.86, .25, ice_clear), (.69, .44, lilac_clear), (.52, .63, rose_soft), (.35, .82, ice))):
            cube(group, f"2020 | strategy layer {i + 1}", (0, 0, z), (w, w * .72, .18), c, rotation=(0, 0, math.radians(45)), radius=.035)
        torus(group, "2020 | system loop", (0, 0, .28), .66, .012, lilac, rotation=(math.radians(90), 0, 0), scale=(1.1, .8, 1))
    elif year == "2021":
        bubbles = [(-.42, 0, .55, .31, lilac_clear), (-.08, -.12, .69, .38, rose_soft), (.34, .07, .63, .32, ice_clear), (.56, -.10, .48, .22, lilac), (-.28, .17, .96, .19, rose_soft)]
        for i, (x, y, z, r, mat) in enumerate(bubbles):
            sphere(group, f"2021 | impact bubble {i + 1}", (x, y, z), r, mat, segments=28, rings=18)
        torus(group, "2021 | collaboration orbit", (0, 0, .58), .78, .015, rose_soft, rotation=(math.radians(74), 0, math.radians(-7)), scale=(1.1, .8, 1))
        sphere(group, "2021 | shared signal", (.01, -.4, .37), .07, pearl, segments=18, rings=12)
    elif year == "2022":
        cube(group, "2022 | foundation cube", (-.27, 0, .37), (.65, .60, .65), ice_clear, rotation=(0, 0, math.radians(45)), radius=.055)
        cube(group, "2022 | launch cube", (.32, -.05, .55), (.61, .56, .61), lilac_clear, rotation=(0, 0, math.radians(45)), radius=.05)
        cube(group, "2022 | rose cube", (.02, -.12, .96), (.56, .52, .56), rose_soft, rotation=(0, 0, math.radians(45)), radius=.05)
        cube(group, "2022 | pearl cube", (-.40, -.14, .95), (.45, .43, .45), ice, rotation=(0, 0, math.radians(45)), radius=.04)
        for i in range(3):
            sphere(group, f"2022 | launch mote {i + 1}", (-.72 + i * .70, .22, 1.29 + (i % 2) * .16), .048, rose if i == 1 else lilac, segments=16, rings=10)
    elif year == "2023":
        # A miniature platform network: three towers, bridging slabs and meeting lights.
        for i, (x, h, mat) in enumerate(((-.52, .70, ice_clear), (0, 1.08, lilac_clear), (.52, .84, rose_soft))):
            cube(group, f"2023 | community tower {i + 1}", (x, 0, .17 + h / 2), (.34, .30, h), mat, radius=.04)
            sphere(group, f"2023 | tower beacon {i + 1}", (x, -.08, .26 + h), .074, rose if i == 1 else pearl, segments=18, rings=12)
        cube(group, "2023 | platform bridge", (0, -.01, .78), (1.30, .26, .10), ice, radius=.025)
        torus(group, "2023 | shared orbit", (0, 0, .41), .71, .012, lilac, rotation=(math.radians(90), 0, 0), scale=(1.18, .78, 1))
        for i in range(5):
            angle = math.tau * i / 5
            sphere(group, f"2023 | community satellite {i + 1}", (math.cos(angle) * .91, math.sin(angle) * .22, .72 + math.sin(angle * 2) * .12), .066, rose_soft if i % 2 else lilac_clear, segments=18, rings=12)
    else:
        build_mountain(group, "2024 | brighter tomorrow peak", center=(0, 0, .13), scale=1.08, summit=True)
        # Slender flag pole and sculpted flag, positioned clear of the summit milestone plaque.
        cylinder(group, "2024 | flag pole", (.56, -.06, 1.92), .018, 1.28, pearl, vertices=16, bevel_width=.004)
        cube(group, "2024 | magenta summit flag", (.79, -.08, 2.39), (.48, .035, .27), rose, rotation=(0, 0, math.radians(-8)), radius=.035)
        sphere(group, "2024 | summit beacon", (.02, -.20, 1.78), .07, pearl, segments=18, rings=12)
        for i in range(4):
            x = -.96 + i * .62
            sphere(group, f"2024 | ascent spark {i + 1}", (x, -.18, 1.18 + i * .13), .035, rose if i % 2 else lilac, segments=12, rings=8)

# Additional glints remain parented to milestone groups, so every ornament follows reflow.
for year, pos in zip(("2018", "2019", "2020", "2021", "2022", "2023", "2024"), wide):
    group = bpy.data.objects.get("Journey_" + year)
    for j, (dx, dy, dz) in enumerate(((-1.03, .23, .40), (1.0, -.08, .52))):
        if year in ("2019", "2024") and j == 1:
            continue
        sphere(group, f"{year} | ambient glint {j + 1}", (dx, dy, dz), .035, lilac_clear if j else pearl, segments=12, rings=8)

# A local equirectangular, floating softbox map powers both Blender and Drei reflections.
hdri = create_studio_hdr()
world = bpy.data.worlds.new("Builstry | Arctic rose studio")
world.use_nodes = True
world.node_tree.nodes.clear()
tex = world.node_tree.nodes.new("ShaderNodeTexEnvironment")
tex.image = hdri
tex.projection = "EQUIRECTANGULAR"
tex.interpolation = "Linear"
tex.location = (-420, 40)
coord = world.node_tree.nodes.new("ShaderNodeTexCoord")
coord.location = (-650, 40)
background = world.node_tree.nodes.new("ShaderNodeBackground")
background.inputs["Strength"].default_value = .72
background.location = (-150, 40)
out = world.node_tree.nodes.new("ShaderNodeOutputWorld")
out.location = (80, 40)
world.node_tree.links.new(coord.outputs["Generated"], tex.inputs["Vector"])
world.node_tree.links.new(tex.outputs["Color"], background.inputs["Color"])
world.node_tree.links.new(background.outputs["Background"], out.inputs["Surface"])
bpy.context.scene.world = world

# Softbox-style lights for inspecting the editable Blender scene; R3F supplies its own lights.
def area_light(name, location, energy, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    direction = Vector((0, 0, 0)) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj

area_light("Key | cool softbox", (-8, -7, 12), 1050, (0.73, 0.83, 1.0), 10)
area_light("Fill | rose softbox", (8, -5, 8), 850, (1.0, 0.57, 0.79), 9)
area_light("Rim | lavender softbox", (1, 5, 11), 1200, (0.66, 0.61, 1.0), 8)

# Studio camera frames all seven stages with room for the editorial title to its left.
camera_data = bpy.data.cameras.new("Builstry Journey | Landscape Preview")
camera = bpy.data.objects.new("Builstry Journey | Landscape Preview", camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (0.0, -28.0, 4.7)
target = Vector((0.0, 0.0, 0.0))
camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
camera_data.type = "ORTHO"
camera_data.ortho_scale = 25.0
bpy.context.scene.camera = camera
camera_data.lens = 55

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT" if hasattr(bpy.types, "BLENDER_EEVEE_NEXT") else "BLENDER_EEVEE"
scene.render.resolution_x = 1942
scene.render.resolution_y = 809
scene.render.resolution_percentage = 50
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = True
scene.view_settings.view_transform = "AgX"
scene.render.filepath = str(OUT / "journey-preview.png")
try:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = 32
except (AttributeError, TypeError):
    pass

# Save an editable source with every object named and grouped by milestone.
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "builstry-journey.blend"))

# Export geometry groups as a compact, texture-free, PBR GLB for browser delivery.
bpy.ops.object.select_all(action="DESELECT")
export_path = str(OUT / "builstry-journey.glb")
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format="GLB",
    export_apply=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
    export_image_format="AUTO",
    export_yup=True,
    export_animations=False,
    export_skins=False,
)
print("Wrote:", export_path, Path(export_path).stat().st_size, "bytes")
print("Wrote:", OUT / "builstry-journey.blend")
print("Wrote:", OUT / "builstry-studio.hdr", (OUT / "builstry-studio.hdr").stat().st_size, "bytes")
