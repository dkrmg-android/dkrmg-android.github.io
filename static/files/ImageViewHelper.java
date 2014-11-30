package hu.dkrmg.android.rollingball;

import android.graphics.Matrix;
import android.widget.ImageView;
import android.widget.RelativeLayout;

/**
 * Created by Gyorgy Denes and Akos Pap
 * Primitive helper class for ImageView manipulation prior to API 11
 * Part of the DKRMG Android Szakkor project
 * Copyright 2014
 * You are more than welcome to reuse and modify this class as long as you keep this comment block.
 *
 * In API 1-10 there was no easy way to rotate or translate an existing ImageView
 *
 * As a student I would want a *single method* to manipulate rotation, translation etc.
 * I would most certainly not want to inherit from the ImageView base class
 *   and manipulate the canvas rotation
 * Neither would I want to worry about matrix operations
 *
 * This class aims to wrap up these complex functionalities to single function calls.
 */
public class ImageViewHelper {


    /**
     * Rotates the ImageView around its centre from its original state.
     * Assumes that image fills its ImageView.
     * Use this in API 1-10 where ImageView.setRotation is not yet available
     * @param imageViewToRotate This is the ImageView which will be rotated in place
     * @param angle Angle of rotation in degrees
     */
    public static void setImageViewRotation(ImageView imageViewToRotate, float angle)
    {
        // ensure that this method actually has an effect
        imageViewToRotate.setScaleType(ImageView.ScaleType.MATRIX);

        // constructing new matrix that scales image to the ImageView
        Matrix matrix = new Matrix();
        float scale = imageViewToRotate.getWidth() / (float) imageViewToRotate.getDrawable().getBounds().width();
        matrix.setScale(scale, scale);
        matrix.postRotate(angle, imageViewToRotate.getWidth() / 2, imageViewToRotate.getHeight() / 2);

        // apply matrix
        imageViewToRotate.setImageMatrix(matrix);
    }

    /**
     * Translates (moves) the ImageView inside its container layout.
     * Use this in API 1-10 where ImageView.setX / setY is not yet available
     * @param imageViewToMove This is the ImageView which will be moved
     * @param posX horizontal offset of the ImageView from the left side of its layout
     * @param posY vertical offset of the ImageView from the top of the layou
     */
    public static void setImageViewPosition(ImageView imageViewToMove, int posX, int posY)
    {
        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) imageViewToMove.getLayoutParams();
        params.topMargin = posY;
        params.leftMargin = posX;
        imageViewToMove.setLayoutParams(params);
    }


}
