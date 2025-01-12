/** Defines the cross module used constants to avoid circular dependencies */
export declare class Constants {
    /** Defines that alpha blending is disabled */
    static readonly ALPHA_DISABLE = 0;
    /** Defines that alpha blending is SRC ALPHA * SRC + DEST */
    static readonly ALPHA_ADD = 1;
    /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    static readonly ALPHA_COMBINE = 2;
    /** Defines that alpha blending is DEST - SRC * DEST */
    static readonly ALPHA_SUBTRACT = 3;
    /** Defines that alpha blending is SRC * DEST */
    static readonly ALPHA_MULTIPLY = 4;
    /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC) * DEST */
    static readonly ALPHA_MAXIMIZED = 5;
    /** Defines that alpha blending is SRC + DEST */
    static readonly ALPHA_ONEONE = 6;
    /** Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST */
    static readonly ALPHA_PREMULTIPLIED = 7;
    /**
     * Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST
     * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
     */
    static readonly ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
    /** Defines that alpha blending is CST * SRC + (1 - CST) * DEST */
    static readonly ALPHA_INTERPOLATE = 9;
    /**
     * Defines that alpha blending is SRC + (1 - SRC) * DEST
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
     */
    static readonly ALPHA_SCREENMODE = 10;
    /**
     * Defines that alpha blending is SRC + DST
     * Alpha will be set to SRC ALPHA + DST ALPHA
     */
    static readonly ALPHA_ONEONE_ONEONE = 11;
    /**
     * Defines that alpha blending is SRC * DST ALPHA + DST
     * Alpha will be set to 0
     */
    static readonly ALPHA_ALPHATOCOLOR = 12;
    /**
     * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
     */
    static readonly ALPHA_REVERSEONEMINUS = 13;
    /**
     * Defines that alpha blending is SRC + DST * (1 - SRC ALPHA)
     * Alpha will be set to SRC ALPHA + DST ALPHA * (1 - SRC ALPHA)
     */
    static readonly ALPHA_SRC_DSTONEMINUSSRCALPHA = 14;
    /**
     * Defines that alpha blending is SRC + DST
     * Alpha will be set to SRC ALPHA
     */
    static readonly ALPHA_ONEONE_ONEZERO = 15;
    /**
     * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
     * Alpha will be set to DST ALPHA
     */
    static readonly ALPHA_EXCLUSION = 16;
    /**
     * Defines that alpha blending is SRC * SRC ALPHA + DST * (1 - SRC ALPHA)
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DST ALPHA
     */
    static readonly ALPHA_LAYER_ACCUMULATE = 17;
    /** Defines that alpha blending equation a SUM */
    static readonly ALPHA_EQUATION_ADD = 0;
    /** Defines that alpha blending equation a SUBSTRACTION */
    static readonly ALPHA_EQUATION_SUBSTRACT = 1;
    /** Defines that alpha blending equation a REVERSE SUBSTRACTION */
    static readonly ALPHA_EQUATION_REVERSE_SUBTRACT = 2;
    /** Defines that alpha blending equation a MAX operation */
    static readonly ALPHA_EQUATION_MAX = 3;
    /** Defines that alpha blending equation a MIN operation */
    static readonly ALPHA_EQUATION_MIN = 4;
    /**
     * Defines that alpha blending equation a DARKEN operation:
     * It takes the min of the src and sums the alpha channels.
     */
    static readonly ALPHA_EQUATION_DARKEN = 5;
    /** Defines that the resource is not delayed*/
    static readonly DELAYLOADSTATE_NONE = 0;
    /** Defines that the resource was successfully delay loaded */
    static readonly DELAYLOADSTATE_LOADED = 1;
    /** Defines that the resource is currently delay loading */
    static readonly DELAYLOADSTATE_LOADING = 2;
    /** Defines that the resource is delayed and has not started loading */
    static readonly DELAYLOADSTATE_NOTLOADED = 4;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
    static readonly NEVER = 512;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    static readonly ALWAYS = 519;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
    static readonly LESS = 513;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
    static readonly EQUAL = 514;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
    static readonly LEQUAL = 515;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
    static readonly GREATER = 516;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
    static readonly GEQUAL = 518;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
    static readonly NOTEQUAL = 517;
    /** Passed to stencilOperation to specify that stencil value must be kept */
    static readonly KEEP = 7680;
    /** Passed to stencilOperation to specify that stencil value must be zero */
    static readonly ZERO = 0;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    static readonly REPLACE = 7681;
    /** Passed to stencilOperation to specify that stencil value must be incremented */
    static readonly INCR = 7682;
    /** Passed to stencilOperation to specify that stencil value must be decremented */
    static readonly DECR = 7683;
    /** Passed to stencilOperation to specify that stencil value must be inverted */
    static readonly INVERT = 5386;
    /** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
    static readonly INCR_WRAP = 34055;
    /** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
    static readonly DECR_WRAP = 34056;
    /** Texture is not repeating outside of 0..1 UVs */
    static readonly TEXTURE_CLAMP_ADDRESSMODE = 0;
    /** Texture is repeating outside of 0..1 UVs */
    static readonly TEXTURE_WRAP_ADDRESSMODE = 1;
    /** Texture is repeating and mirrored */
    static readonly TEXTURE_MIRROR_ADDRESSMODE = 2;
    /** Flag to create a storage texture */
    static readonly TEXTURE_CREATIONFLAG_STORAGE = 1;
    /** ALPHA */
    static readonly TEXTUREFORMAT_ALPHA = 0;
    /** LUMINANCE */
    static readonly TEXTUREFORMAT_LUMINANCE = 1;
    /** LUMINANCE_ALPHA */
    static readonly TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
    /** RGB */
    static readonly TEXTUREFORMAT_RGB = 4;
    /** RGBA */
    static readonly TEXTUREFORMAT_RGBA = 5;
    /** RED */
    static readonly TEXTUREFORMAT_RED = 6;
    /** RED (2nd reference) */
    static readonly TEXTUREFORMAT_R = 6;
    /** RG */
    static readonly TEXTUREFORMAT_RG = 7;
    /** RED_INTEGER */
    static readonly TEXTUREFORMAT_RED_INTEGER = 8;
    /** RED_INTEGER (2nd reference) */
    static readonly TEXTUREFORMAT_R_INTEGER = 8;
    /** RG_INTEGER */
    static readonly TEXTUREFORMAT_RG_INTEGER = 9;
    /** RGB_INTEGER */
    static readonly TEXTUREFORMAT_RGB_INTEGER = 10;
    /** RGBA_INTEGER */
    static readonly TEXTUREFORMAT_RGBA_INTEGER = 11;
    /** BGRA */
    static readonly TEXTUREFORMAT_BGRA = 12;
    /** Depth 24 bits + Stencil 8 bits */
    static readonly TEXTUREFORMAT_DEPTH24_STENCIL8 = 13;
    /** Depth 32 bits float */
    static readonly TEXTUREFORMAT_DEPTH32_FLOAT = 14;
    /** Depth 16 bits */
    static readonly TEXTUREFORMAT_DEPTH16 = 15;
    /** Depth 24 bits */
    static readonly TEXTUREFORMAT_DEPTH24 = 16;
    /** Depth 24 bits unorm + Stencil 8 bits */
    static readonly TEXTUREFORMAT_DEPTH24UNORM_STENCIL8 = 17;
    /** Depth 32 bits float + Stencil 8 bits */
    static readonly TEXTUREFORMAT_DEPTH32FLOAT_STENCIL8 = 18;
    /** Stencil 8 bits */
    static readonly TEXTUREFORMAT_STENCIL8 = 19;
    /** UNDEFINED */
    static readonly TEXTUREFORMAT_UNDEFINED = 4294967295;
    /** Compressed BC7 */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA_BPTC_UNORM = 36492;
    /** Compressed BC7 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_BPTC_UNORM = 36493;
    /** Compressed BC6 unsigned float */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT = 36495;
    /** Compressed BC6 signed float */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB_BPTC_SIGNED_FLOAT = 36494;
    /** Compressed BC3 */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT5 = 33779;
    /** Compressed BC3 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919;
    /** Compressed BC2 */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT3 = 33778;
    /** Compressed BC2 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918;
    /** Compressed BC1 (RGBA) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT1 = 33777;
    /** Compressed BC1 (RGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB_S3TC_DXT1 = 33776;
    /** Compressed BC1 (SRGB+A) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917;
    /** Compressed BC1 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916;
    /** Compressed ASTC 4x4 */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA_ASTC_4x4 = 37808;
    /** Compressed ASTC 4x4 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 37840;
    /** Compressed ETC1 (RGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB_ETC1_WEBGL = 36196;
    /** Compressed ETC2 (RGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB8_ETC2 = 37492;
    /** Compressed ETC2 (SRGB) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB8_ETC2 = 37493;
    /** Compressed ETC2 (RGB+A1) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494;
    /** Compressed ETC2 (SRGB+A1)*/
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495;
    /** Compressed ETC2 (RGB+A) */
    static readonly TEXTUREFORMAT_COMPRESSED_RGBA8_ETC2_EAC = 37496;
    /** Compressed ETC2 (SRGB+1) */
    static readonly TEXTUREFORMAT_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497;
    /** UNSIGNED_BYTE */
    static readonly TEXTURETYPE_UNSIGNED_BYTE = 0;
    /** UNSIGNED_BYTE (2nd reference) */
    static readonly TEXTURETYPE_UNSIGNED_INT = 0;
    /** FLOAT */
    static readonly TEXTURETYPE_FLOAT = 1;
    /** HALF_FLOAT */
    static readonly TEXTURETYPE_HALF_FLOAT = 2;
    /** BYTE */
    static readonly TEXTURETYPE_BYTE = 3;
    /** SHORT */
    static readonly TEXTURETYPE_SHORT = 4;
    /** UNSIGNED_SHORT */
    static readonly TEXTURETYPE_UNSIGNED_SHORT = 5;
    /** INT */
    static readonly TEXTURETYPE_INT = 6;
    /** UNSIGNED_INT */
    static readonly TEXTURETYPE_UNSIGNED_INTEGER = 7;
    /** UNSIGNED_SHORT_4_4_4_4 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
    /** UNSIGNED_SHORT_5_5_5_1 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
    /** UNSIGNED_SHORT_5_6_5 */
    static readonly TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
    /** UNSIGNED_INT_2_10_10_10_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
    /** UNSIGNED_INT_24_8 */
    static readonly TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
    /** UNSIGNED_INT_10F_11F_11F_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
    /** UNSIGNED_INT_5_9_9_9_REV */
    static readonly TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
    /** FLOAT_32_UNSIGNED_INT_24_8_REV */
    static readonly TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
    /** UNDEFINED */
    static readonly TEXTURETYPE_UNDEFINED = 16;
    /** 2D Texture target*/
    static readonly TEXTURE_2D = 3553;
    /** 2D Array Texture target */
    static readonly TEXTURE_2D_ARRAY = 35866;
    /** Cube Map Texture target */
    static readonly TEXTURE_CUBE_MAP = 34067;
    /** Cube Map Array Texture target */
    static readonly TEXTURE_CUBE_MAP_ARRAY = 3735928559;
    /** 3D Texture target */
    static readonly TEXTURE_3D = 32879;
    /** nearest is mag = nearest and min = nearest and no mip */
    static readonly TEXTURE_NEAREST_SAMPLINGMODE = 1;
    /** mag = nearest and min = nearest and mip = none */
    static readonly TEXTURE_NEAREST_NEAREST = 1;
    /** Bilinear is mag = linear and min = linear and no mip */
    static readonly TEXTURE_BILINEAR_SAMPLINGMODE = 2;
    /** mag = linear and min = linear and mip = none */
    static readonly TEXTURE_LINEAR_LINEAR = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    static readonly TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    static readonly TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
    /** mag = nearest and min = nearest and mip = nearest */
    static readonly TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
    /** mag = nearest and min = linear and mip = nearest */
    static readonly TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
    /** mag = nearest and min = linear and mip = linear */
    static readonly TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
    /** mag = nearest and min = linear and mip = none */
    static readonly TEXTURE_NEAREST_LINEAR = 7;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    static readonly TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
    /** mag = linear and min = nearest and mip = nearest */
    static readonly TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
    /** mag = linear and min = nearest and mip = linear */
    static readonly TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    static readonly TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
    /** mag = linear and min = nearest and mip = none */
    static readonly TEXTURE_LINEAR_NEAREST = 12;
    /** Explicit coordinates mode */
    static readonly TEXTURE_EXPLICIT_MODE = 0;
    /** Spherical coordinates mode */
    static readonly TEXTURE_SPHERICAL_MODE = 1;
    /** Planar coordinates mode */
    static readonly TEXTURE_PLANAR_MODE = 2;
    /** Cubic coordinates mode */
    static readonly TEXTURE_CUBIC_MODE = 3;
    /** Projection coordinates mode */
    static readonly TEXTURE_PROJECTION_MODE = 4;
    /** Skybox coordinates mode */
    static readonly TEXTURE_SKYBOX_MODE = 5;
    /** Inverse Cubic coordinates mode */
    static readonly TEXTURE_INVCUBIC_MODE = 6;
    /** Equirectangular coordinates mode */
    static readonly TEXTURE_EQUIRECTANGULAR_MODE = 7;
    /** Equirectangular Fixed coordinates mode */
    static readonly TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
    /** Equirectangular Fixed Mirrored coordinates mode */
    static readonly TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
    /** Offline (baking) quality for texture filtering */
    static readonly TEXTURE_FILTERING_QUALITY_OFFLINE = 4096;
    /** High quality for texture filtering */
    static readonly TEXTURE_FILTERING_QUALITY_HIGH = 64;
    /** Medium quality for texture filtering */
    static readonly TEXTURE_FILTERING_QUALITY_MEDIUM = 16;
    /** Low quality for texture filtering */
    static readonly TEXTURE_FILTERING_QUALITY_LOW = 8;
    /** Defines that texture rescaling will use a floor to find the closer power of 2 size */
    static readonly SCALEMODE_FLOOR = 1;
    /** Defines that texture rescaling will look for the nearest power of 2 size */
    static readonly SCALEMODE_NEAREST = 2;
    /** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
    static readonly SCALEMODE_CEILING = 3;
    /**
     * The dirty texture flag value
     */
    static readonly MATERIAL_TextureDirtyFlag = 1;
    /**
     * The dirty light flag value
     */
    static readonly MATERIAL_LightDirtyFlag = 2;
    /**
     * The dirty fresnel flag value
     */
    static readonly MATERIAL_FresnelDirtyFlag = 4;
    /**
     * The dirty attribute flag value
     */
    static readonly MATERIAL_AttributesDirtyFlag = 8;
    /**
     * The dirty misc flag value
     */
    static readonly MATERIAL_MiscDirtyFlag = 16;
    /**
     * The dirty prepass flag value
     */
    static readonly MATERIAL_PrePassDirtyFlag = 32;
    /**
     * The all dirty flag value
     */
    static readonly MATERIAL_AllDirtyFlag = 63;
    /**
     * Returns the triangle fill mode
     */
    static readonly MATERIAL_TriangleFillMode = 0;
    /**
     * Returns the wireframe mode
     */
    static readonly MATERIAL_WireFrameFillMode = 1;
    /**
     * Returns the point fill mode
     */
    static readonly MATERIAL_PointFillMode = 2;
    /**
     * Returns the point list draw mode
     */
    static readonly MATERIAL_PointListDrawMode = 3;
    /**
     * Returns the line list draw mode
     */
    static readonly MATERIAL_LineListDrawMode = 4;
    /**
     * Returns the line loop draw mode
     */
    static readonly MATERIAL_LineLoopDrawMode = 5;
    /**
     * Returns the line strip draw mode
     */
    static readonly MATERIAL_LineStripDrawMode = 6;
    /**
     * Returns the triangle strip draw mode
     */
    static readonly MATERIAL_TriangleStripDrawMode = 7;
    /**
     * Returns the triangle fan draw mode
     */
    static readonly MATERIAL_TriangleFanDrawMode = 8;
    /**
     * Stores the clock-wise side orientation
     */
    static readonly MATERIAL_ClockWiseSideOrientation = 0;
    /**
     * Stores the counter clock-wise side orientation
     */
    static readonly MATERIAL_CounterClockWiseSideOrientation = 1;
    /**
     * Nothing
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_NothingTrigger = 0;
    /**
     * On pick
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPickTrigger = 1;
    /**
     * On left pick
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnLeftPickTrigger = 2;
    /**
     * On right pick
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnRightPickTrigger = 3;
    /**
     * On center pick
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnCenterPickTrigger = 4;
    /**
     * On pick down
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPickDownTrigger = 5;
    /**
     * On double pick
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnDoublePickTrigger = 6;
    /**
     * On pick up
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPickUpTrigger = 7;
    /**
     * On pick out.
     * This trigger will only be raised if you also declared a OnPickDown
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPickOutTrigger = 16;
    /**
     * On long press
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnLongPressTrigger = 8;
    /**
     * On pointer over
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPointerOverTrigger = 9;
    /**
     * On pointer out
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnPointerOutTrigger = 10;
    /**
     * On every frame
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnEveryFrameTrigger = 11;
    /**
     * On intersection enter
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnIntersectionEnterTrigger = 12;
    /**
     * On intersection exit
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnIntersectionExitTrigger = 13;
    /**
     * On key down
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnKeyDownTrigger = 14;
    /**
     * On key up
     * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
     */
    static readonly ACTION_OnKeyUpTrigger = 15;
    /**
     * Billboard mode will only apply to Y axis
     */
    static readonly PARTICLES_BILLBOARDMODE_Y = 2;
    /**
     * Billboard mode will apply to all axes
     */
    static readonly PARTICLES_BILLBOARDMODE_ALL = 7;
    /**
     * Special billboard mode where the particle will be biilboard to the camera but rotated to align with direction
     */
    static readonly PARTICLES_BILLBOARDMODE_STRETCHED = 8;
    /**
     * Special billboard mode where the particle will be billboard to the camera but only around the axis of the direction of particle emission
     */
    static readonly PARTICLES_BILLBOARDMODE_STRETCHED_LOCAL = 9;
    /** Default culling strategy : this is an exclusion test and it's the more accurate.
     *  Test order :
     *  Is the bounding sphere outside the frustum ?
     *  If not, are the bounding box vertices outside the frustum ?
     *  It not, then the cullable object is in the frustum.
     */
    static readonly MESHES_CULLINGSTRATEGY_STANDARD = 0;
    /** Culling strategy : Bounding Sphere Only.
     *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
     *  It's also less accurate than the standard because some not visible objects can still be selected.
     *  Test : is the bounding sphere outside the frustum ?
     *  If not, then the cullable object is in the frustum.
     */
    static readonly MESHES_CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
    /** Culling strategy : Optimistic Inclusion.
     *  This in an inclusion test first, then the standard exclusion test.
     *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
     *  Anyway, it's as accurate as the standard strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the default culling strategy.
     */
    static readonly MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
    /** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
     *  This in an inclusion test first, then the bounding sphere only exclusion test.
     *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
     *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
     */
    static readonly MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
    /**
     * No logging while loading
     */
    static readonly SCENELOADER_NO_LOGGING = 0;
    /**
     * Minimal logging while loading
     */
    static readonly SCENELOADER_MINIMAL_LOGGING = 1;
    /**
     * Summary logging while loading
     */
    static readonly SCENELOADER_SUMMARY_LOGGING = 2;
    /**
     * Detailed logging while loading
     */
    static readonly SCENELOADER_DETAILED_LOGGING = 3;
    /**
     * Constant used to retrieve the irradiance texture index in the textures array in the prepass
     * using getIndex(Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE)
     */
    static readonly PREPASS_IRRADIANCE_TEXTURE_TYPE = 0;
    /**
     * Constant used to retrieve the position texture index in the textures array in the prepass
     * using getIndex(Constants.PREPASS_POSITION_TEXTURE_INDEX)
     */
    static readonly PREPASS_POSITION_TEXTURE_TYPE = 1;
    /**
     * Constant used to retrieve the velocity texture index in the textures array in the prepass
     * using getIndex(Constants.PREPASS_VELOCITY_TEXTURE_INDEX)
     */
    static readonly PREPASS_VELOCITY_TEXTURE_TYPE = 2;
    /**
     * Constant used to retrieve the reflectivity texture index in the textures array in the prepass
     * using the getIndex(Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE)
     */
    static readonly PREPASS_REFLECTIVITY_TEXTURE_TYPE = 3;
    /**
     * Constant used to retrieve the lit color texture index in the textures array in the prepass
     * using the getIndex(Constants.PREPASS_COLOR_TEXTURE_TYPE)
     */
    static readonly PREPASS_COLOR_TEXTURE_TYPE = 4;
    /**
     * Constant used to retrieve depth index in the textures array in the prepass
     * using the getIndex(Constants.PREPASS_DEPTH_TEXTURE_TYPE)
     */
    static readonly PREPASS_DEPTH_TEXTURE_TYPE = 5;
    /**
     * Constant used to retrieve normal index in the textures array in the prepass
     * using the getIndex(Constants.PREPASS_NORMAL_TEXTURE_TYPE)
     */
    static readonly PREPASS_NORMAL_TEXTURE_TYPE = 6;
    /**
     * Constant used to retrieve albedo index in the textures array in the prepass
     * using the getIndex(Constants.PREPASS_ALBEDO_SQRT_TEXTURE_TYPE)
     */
    static readonly PREPASS_ALBEDO_SQRT_TEXTURE_TYPE = 7;
    /** Flag to create a readable buffer (the buffer can be the source of a copy) */
    static readonly BUFFER_CREATIONFLAG_READ = 1;
    /** Flag to create a writable buffer (the buffer can be the destination of a copy) */
    static readonly BUFFER_CREATIONFLAG_WRITE = 2;
    /** Flag to create a readable and writable buffer */
    static readonly BUFFER_CREATIONFLAG_READWRITE = 3;
    /** Flag to create a buffer suitable to be used as a uniform buffer */
    static readonly BUFFER_CREATIONFLAG_UNIFORM = 4;
    /** Flag to create a buffer suitable to be used as a vertex buffer */
    static readonly BUFFER_CREATIONFLAG_VERTEX = 8;
    /** Flag to create a buffer suitable to be used as an index buffer */
    static readonly BUFFER_CREATIONFLAG_INDEX = 16;
    /** Flag to create a buffer suitable to be used as a storage buffer */
    static readonly BUFFER_CREATIONFLAG_STORAGE = 32;
    /** Flag to create a buffer suitable to be used for indirect calls, such as `dispatchIndirect` */
    static readonly BUFFER_CREATIONFLAG_INDIRECT = 64;
    /**
     * Prefixes used by the engine for sub mesh draw wrappers
     */
    /** @internal */
    static readonly RENDERPASS_MAIN = 0;
    /**
     * Constant used as key code for Alt key
     */
    static readonly INPUT_ALT_KEY = 18;
    /**
     * Constant used as key code for Ctrl key
     */
    static readonly INPUT_CTRL_KEY = 17;
    /**
     * Constant used as key code for Meta key (Left Win, Left Cmd)
     */
    static readonly INPUT_META_KEY1 = 91;
    /**
     * Constant used as key code for Meta key (Right Win)
     */
    static readonly INPUT_META_KEY2 = 92;
    /**
     * Constant used as key code for Meta key (Right Win, Right Cmd)
     */
    static readonly INPUT_META_KEY3 = 93;
    /**
     * Constant used as key code for Shift key
     */
    static readonly INPUT_SHIFT_KEY = 16;
    /** Standard snapshot rendering. In this mode, some form of dynamic behavior is possible (for eg, uniform buffers are still updated) */
    static readonly SNAPSHOTRENDERING_STANDARD = 0;
    /** Fast snapshot rendering. In this mode, everything is static and only some limited form of dynamic behaviour is possible */
    static readonly SNAPSHOTRENDERING_FAST = 1;
    /**
     * This is the default projection mode used by the cameras.
     * It helps recreating a feeling of perspective and better appreciate depth.
     * This is the best way to simulate real life cameras.
     */
    static readonly PERSPECTIVE_CAMERA = 0;
    /**
     * This helps creating camera with an orthographic mode.
     * Orthographic is commonly used in engineering as a means to produce object specifications that communicate dimensions unambiguously, each line of 1 unit length (cm, meter..whatever) will appear to have the same length everywhere on the drawing. This allows the drafter to dimension only a subset of lines and let the reader know that other lines of that length on the drawing are also that length in reality. Every parallel line in the drawing is also parallel in the object.
     */
    static readonly ORTHOGRAPHIC_CAMERA = 1;
    /**
     * This is the default FOV mode for perspective cameras.
     * This setting aligns the upper and lower bounds of the viewport to the upper and lower bounds of the camera frustum.
     */
    static readonly FOVMODE_VERTICAL_FIXED = 0;
    /**
     * This setting aligns the left and right bounds of the viewport to the left and right bounds of the camera frustum.
     */
    static readonly FOVMODE_HORIZONTAL_FIXED = 1;
    /**
     * This specifies there is no need for a camera rig.
     * Basically only one eye is rendered corresponding to the camera.
     */
    static readonly RIG_MODE_NONE = 0;
    /**
     * Simulates a camera Rig with one blue eye and one red eye.
     * This can be use with 3d blue and red glasses.
     */
    static readonly RIG_MODE_STEREOSCOPIC_ANAGLYPH = 10;
    /**
     * Defines that both eyes of the camera will be rendered side by side with a parallel target.
     */
    static readonly RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL = 11;
    /**
     * Defines that both eyes of the camera will be rendered side by side with a none parallel target.
     */
    static readonly RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED = 12;
    /**
     * Defines that both eyes of the camera will be rendered over under each other.
     */
    static readonly RIG_MODE_STEREOSCOPIC_OVERUNDER = 13;
    /**
     * Defines that both eyes of the camera will be rendered on successive lines interlaced for passive 3d monitors.
     */
    static readonly RIG_MODE_STEREOSCOPIC_INTERLACED = 14;
    /**
     * Defines that both eyes of the camera should be renderered in a VR mode (carbox).
     */
    static readonly RIG_MODE_VR = 20;
    /**
     * Custom rig mode allowing rig cameras to be populated manually with any number of cameras
     */
    static readonly RIG_MODE_CUSTOM = 22;
    /**
     * Maximum number of uv sets supported
     */
    static readonly MAX_SUPPORTED_UV_SETS = 6;
    /**
     * GL constants
     */
    /** Alpha blend equation: ADD */
    static readonly GL_ALPHA_EQUATION_ADD = 32774;
    /** Alpha equation: MIN */
    static readonly GL_ALPHA_EQUATION_MIN = 32775;
    /** Alpha equation: MAX */
    static readonly GL_ALPHA_EQUATION_MAX = 32776;
    /** Alpha equation: SUBTRACT */
    static readonly GL_ALPHA_EQUATION_SUBTRACT = 32778;
    /** Alpha equation: REVERSE_SUBTRACT */
    static readonly GL_ALPHA_EQUATION_REVERSE_SUBTRACT = 32779;
    /** Alpha blend function: SRC */
    static readonly GL_ALPHA_FUNCTION_SRC = 768;
    /** Alpha blend function: ONE_MINUS_SRC */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_SRC_COLOR = 769;
    /** Alpha blend function: SRC_ALPHA */
    static readonly GL_ALPHA_FUNCTION_SRC_ALPHA = 770;
    /** Alpha blend function: ONE_MINUS_SRC_ALPHA */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA = 771;
    /** Alpha blend function: DST_ALPHA */
    static readonly GL_ALPHA_FUNCTION_DST_ALPHA = 772;
    /** Alpha blend function: ONE_MINUS_DST_ALPHA */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_DST_ALPHA = 773;
    /** Alpha blend function: ONE_MINUS_DST */
    static readonly GL_ALPHA_FUNCTION_DST_COLOR = 774;
    /** Alpha blend function: ONE_MINUS_DST */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_DST_COLOR = 775;
    /** Alpha blend function: SRC_ALPHA_SATURATED */
    static readonly GL_ALPHA_FUNCTION_SRC_ALPHA_SATURATED = 776;
    /** Alpha blend function: CONSTANT */
    static readonly GL_ALPHA_FUNCTION_CONSTANT_COLOR = 32769;
    /** Alpha blend function: ONE_MINUS_CONSTANT */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_CONSTANT_COLOR = 32770;
    /** Alpha blend function: CONSTANT_ALPHA */
    static readonly GL_ALPHA_FUNCTION_CONSTANT_ALPHA = 32771;
    /** Alpha blend function: ONE_MINUS_CONSTANT_ALPHA */
    static readonly GL_ALPHA_FUNCTION_ONE_MINUS_CONSTANT_ALPHA = 32772;
    /** URL to the snippet server. Points to the public snippet server by default */
    static SnippetUrl: string;
    /** The fog is deactivated */
    static FOGMODE_NONE: number;
    /** The fog density is following an exponential function */
    static FOGMODE_EXP: number;
    /** The fog density is following an exponential function faster than FOGMODE_EXP */
    static FOGMODE_EXP2: number;
    /** The fog density is following a linear function. */
    static FOGMODE_LINEAR: number;
    /**
     * The byte type.
     */
    static BYTE: number;
    /**
     * The unsigned byte type.
     */
    static UNSIGNED_BYTE: number;
    /**
     * The short type.
     */
    static SHORT: number;
    /**
     * The unsigned short type.
     */
    static UNSIGNED_SHORT: number;
    /**
     * The integer type.
     */
    static INT: number;
    /**
     * The unsigned integer type.
     */
    static UNSIGNED_INT: number;
    /**
     * The float type.
     */
    static FLOAT: number;
    /**
     * Positions
     */
    static PositionKind: string;
    /**
     * Normals
     */
    static NormalKind: string;
    /**
     * Tangents
     */
    static TangentKind: string;
    /**
     * Texture coordinates
     */
    static UVKind: string;
    /**
     * Texture coordinates 2
     */
    static UV2Kind: string;
    /**
     * Texture coordinates 3
     */
    static UV3Kind: string;
    /**
     * Texture coordinates 4
     */
    static UV4Kind: string;
    /**
     * Texture coordinates 5
     */
    static UV5Kind: string;
    /**
     * Texture coordinates 6
     */
    static UV6Kind: string;
    /**
     * Colors
     */
    static ColorKind: string;
    /**
     * Instance Colors
     */
    static ColorInstanceKind: string;
    /**
     * Matrix indices (for bones)
     */
    static MatricesIndicesKind: string;
    /**
     * Matrix weights (for bones)
     */
    static MatricesWeightsKind: string;
    /**
     * Additional matrix indices (for bones)
     */
    static MatricesIndicesExtraKind: string;
    /**
     * Additional matrix weights (for bones)
     */
    static MatricesWeightsExtraKind: string;
}
