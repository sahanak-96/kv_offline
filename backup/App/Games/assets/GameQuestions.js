function createGameWiseQuestions() {

    //================================================Grade - 8 ====================================//

    console.log("gameAssetsPath= " + gameAssetsPath)
    switch (gameAssetsPath) {
        //////////////////////////////////////////new games///////////////////////////////////
        case 'Calendar-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'Calendar-Level2/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'DiscoverMe-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'DiceAddition-Level3/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'DiscoverMe-Level2/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'AreWeSame/':
            totalQuestions = 20;
            break;

        case 'AscendingOrder/':
            totalQuestions = 10;
            break;

        case 'BallPosition-Level1/':
            totalQuestions = 10;
            break;

        case 'BallPosition-Level2/':
            totalQuestions = 50;
            break;

        case 'CarNumber/':
            totalQuestions = 15;
            break;

        case 'CompleteMe-Level2/':
            totalQuestions = 18;
            break;

        case 'SensoryWords-Level1/':
            totalQuestions = 34;
            break;

        case 'ChoosingShapes-Level1/':
            totalQuestions = 11;
            break;
        case 'ChoosingShapes-Level2/':
            totalQuestions = 11;
            break;


        case 'FindTheCar/':
            totalQuestions = 15;
            break;
        case 'RhymingWords/':
            totalQuestions = 20;
            break;
        case 'SensoryWords-Level2/':
            totalQuestions = 34;
            break;
        case 'ShapeBreak/':
            totalQuestions = 10;
            break;
        case 'WhatsMyColor-Level1/':
            totalQuestions = 10;
            break;
        case 'WhatsMyColor-Level2/':
            totalQuestions = 10;
            break;
        case 'WhereIBelong/':
            totalQuestions = 29;
            break;
        case 'WhereIBelong-Transport/':
            totalQuestions = 14;
            break;
        case 'WhereItBelongs/':
            totalQuestions = 20;
            break;


        case 'NumberMe/':
            totalQuestions = 18;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'OddGroup/':
            totalQuestions = 24
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'OddObject/':
            totalQuestions = 15
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;

        case 'DropMe/':
            totalQuestions = 10;
            break;
        case 'PlayTheDrums/':
            totalQuestions = 20;
            break;
        case 'ShadowMatch/':
            totalQuestions = 20;
            break;
        case 'ShadowWar/':
            totalQuestions = 10;
            break;

        case 'FindTheEdges/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;

        case 'FindTheFaces/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;

        case 'Alternative/':
            totalQuestions = 13;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;

        case 'MatchTheCount/':
            totalQuestions = 18;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'Alternatives/':
            totalQuestions = 13;
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;


        case 'OddOneOut-Level1/':
            totalQuestions = 20
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'OddOneOut-Level2/':
            totalQuestions = 20
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'Sorting-Level1/':
            totalQuestions = 10
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);
            break;
        case 'Sorting-Level2/':
            totalQuestions = 10
            qno.splice(qno.indexOf(0), 1);
            qno.push(0);

            break;
        case 'LetterSeries-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'LetterSeries-Level2/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'LetterWeb/':
            totalQuestions = 13;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'CountMyHand-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'DigitalAlphaCount-Level3/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'DigitalSegment-Level1/':
            totalQuestions = 16;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'MissingShapes-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
        case 'MissingShapes-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
        case 'CountMyHand-Level2/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ColorInColor-Level1/':
            totalQuestions = 12;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ColorInColor-Level2/':
            totalQuestions = 12;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FindTheSame/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FlippedImage/':
            totalQuestions = 30;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'DragTheShapes-Level2/':
            totalQuestions = 11;
            break;
        case 'DragTheShapes-Level3/':
            totalQuestions = 20;
            break;
        case 'FindThePair/':
            totalQuestions = 12;
            break;
        case 'FindTheSamePattern/':
            totalQuestions = 30;
            break;
        case 'GiftBox/':
            totalQuestions = 16;
            break;
        case 'Halves/':
            totalQuestions = 18;
            break;
        case 'IconSmiley-Level1/':
            totalQuestions = 16;
            break;

        case 'DigitalAlphaCount-Level1/':
            totalQuestions = 20;
            break;
        case 'DigitalAlphaCount-Level2/':
            totalQuestions = 20;
            break;
        case 'FindMyHalf/':
            totalQuestions = 16;
            break;

        case 'DragTheShapes-Level1/':
            totalQuestions = 11;
            break;
        case 'IconSmiley-Level2/':
            totalQuestions = 40;
            break;

        case 'Angles-Level1/':
            totalQuestions = 10;
            break;
        case 'Angles-Level2/':
            totalQuestions = 10;
            break;
        case 'BotanicalName/':
            totalQuestions = 10;
            break;
        case 'FindNext-Level1/':
            totalQuestions = 10;
            break;
        case 'DivideTheWheel-Level1/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'DivideTheWheel-Level2/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'LetterWeb/':
            totalQuestions = 13;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'CountMe/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'DigitalWord-Level1/':
            totalQuestions = 19;

            break;
        case 'FindNext-Level2/':
            totalQuestions = 10;
            break;
        case 'FindTheFreak-KG/':
            totalQuestions = 10;
            break;
        case 'GeometricShapes-Level1/':
            totalQuestions = 11;
            break;
        case 'GeometricShapes-Level2/':
            totalQuestions = 11;
            break;
        case 'ShapeDimension/':
            totalQuestions = 30;
            break;
        case 'MissingPair/':
            totalQuestions = 30;
            break;
        case 'NamesOfSymbols-Level1/':
            totalQuestions = 21;
            break;
        case 'NamesOfSymbols-Level2/':
            totalQuestions = 21;
            break;
        case 'NumberAnalogy-Level1/':
            totalQuestions = 24;
            break;

        case 'NumberAnalogy-Level2/':
            totalQuestions = 25;
            break;
        case 'HiddenObjects-Level2/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'HiddenObjects-Level1/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'Calculate-Level1/':
            totalQuestions = 14;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'Calculate-Level2/':
            totalQuestions = 14;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'MissingColor/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NumberBurst/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FruitColor/':
            totalQuestions = 12;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ObjectColor/':
            totalQuestions = 12;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'Opposites/':
            totalQuestions = 16;
            break;
        case 'Punching/':
            totalQuestions = 10;
            break;

        case 'FlippedImage-Level2/':
            totalQuestions = 29;
            break;
        case 'FlippedImage-Level3/':
            totalQuestions = 29;
            break;
        case 'FlippedImage-Level4/':
            totalQuestions = 29;
            break;




            //===========================================New Games End===================================================//
            //==================================================SBC2 Starts//=====================================================//
        case 'AddGuru-Level2/':
            totalQuestions = 19;
            break;

        case 'AlphabetTrain-Level2/':
            totalQuestions = 24;
            break;

        case 'Anagrams-Level2/':
            totalQuestions = 29;
            break;

        case 'AnimalTravel-Level2/':
            totalQuestions = 24;
            break;

        case 'BeginToEnd-Level2/':
            totalQuestions = 14;
            break;

        case 'BubbleShift-LKGR2/':
            totalQuestions = 49;
            break;

        case 'BubbleShift-UKGR2/':
            totalQuestions = 49;
            break;

        case 'CardArithmetic-Level2/':
            totalQuestions = 44;
            break;

        case 'ClockGrid-Level2/':
            totalQuestions = 24;
            break;

        case 'FormTheShape-Level2/':
            totalQuestions = 22;
            break;

        case 'HandAlphabet-Level2/':
            totalQuestions = 17;
            break;

        case 'Homographs-Level2/':
            totalQuestions = 17;
            break;

        case 'ItsNotMe-Level2/':
            totalQuestions = 16;
            break;

        case 'JackInTheBox-Level2/':
            totalQuestions = 45;
            break;

        case 'JigsawPieces-Level2/':
            totalQuestions = 50;
            break;

        case 'JumbledLetter-Level2/':
            totalQuestions = 44;
            break;

        case 'MagicalWords-Level2/':
            totalQuestions = 14;
            break;

        case 'ObjectMemory-LKGR2/':
            totalQuestions = 50;
            break;

        case 'ObjectMemory-UKGR2/':
            totalQuestions = 50;
            break;

        case 'ObjectSort-Level2/':
            totalQuestions = 19;
            break;

        case 'OutOfFocus-Level2/':
            totalQuestions = 50;
            break;

        case 'PhotoShop-Level2/':
            totalQuestions = 39;
            break;

        case 'PictureJackpot-Level2/':
            totalQuestions = 36;
            break;

        case 'RememberMyName-Level2/':
            totalQuestions = 27;
            break;

        case 'VennDiagram-Level2/':
            totalQuestions = 10;
            break;

        case 'VowelsInARow-Level2/':
            totalQuestions = 37;
            break;



        case 'FitIn-Level2/':
            totalQuestions = 22;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'TopView-Level2/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FitThePiece-Level2/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'MotionMaster-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'FaceMask-Level2/':
            totalQuestions = 30;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NotAPair-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'RearMagic-Level2/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ShadowLights-Level2/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ShadowLights-LKGR2/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ShadowLights-UKGR2/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'FormTheFace-Level2/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ArithmeticChallenge-Level2/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'FracturedFraction-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;



        case 'NumberPuzzle-Level2-SBC2/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'TrickyNumbers-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ObjectSort-LKGR2/':
            totalQuestions = 18;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ObjectSort-UKGR2/':
            totalQuestions = 18;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;



        case 'NotAPair-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;



        case 'DecodeMe-Level2/':
            totalQuestions = 49;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FruitBalance-Level2/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'PicturePreposition-Level2/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NameIt-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;




        case 'VowelTrain-LKGR2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'VowelTrain-UKGR2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'BubbleShift-Level2/':
            totalQuestions = 50;
            break;

        case 'ObjectMemory-Level2/':
            totalQuestions = 50;
            break;

        case 'JungleSpot-Level2/':
            totalQuestions = 50;
            break;

        case 'AlienSmiley-Level2/':
            totalQuestions = 50;
            break;

        case 'Anagrams-Level2/':
            totalQuestions = 50;
            break;

        case 'AnimalLeap-Level2/':
            totalQuestions = 24;
            break;

        case 'ArrowWatch-Level2/':
            totalQuestions = 15;
            break;

        case 'SpotTheOddOneOut-Level2/':
            totalQuestions = 19;
            break;

        case 'ChessBoard-Level2/':
            totalQuestions = 50;
            break;


        case "ColorFix-Level2/":
            totalQuestions = 19;
            break;
        case "ColorSpot-Level2/":
            totalQuestions = 40;
            break;
        case "HippityHop-Level2/":
            totalQuestions = 50;
            break;
        case "IconsInAction-Level2/":
            totalQuestions = 50;
            break;

        case "ItsGlowing-Level2/":
            totalQuestions = 15;
            break;




        case "MissingLetter-Level3-SBC2/":
            totalQuestions = 49;
            break;

        case "MissingLetter-Level4-SBC2/":
            totalQuestions = 49;
            break;
        case "ObjectMemory-Level2/":
            totalQuestions = 50;
            break;
        case "PictureNamePair-Level2/":
            totalQuestions = 50;
            break;
        case "ShadesOfMeaning-Level1/":
            totalQuestions = 49;
            break;
        case "ShapeShifters-Level2/":
            totalQuestions = 10;
            break;
        case "SmileyCatch-Level2/":
            totalQuestions = 30;
            break;


        case "UnLockTheSuitcase-Level2/":
            totalQuestions = 50;
            break;
            //==================================================SBC2 Ends//=====================================================//
            //===========================================SBC=======================================//        
        case 'Anagrams-Level1/':
            totalQuestions = 49;


            break;
        case 'PictureNamePair-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'TeamUp-Level1/':
            totalQuestions = 24;

            break;
        case 'ClockGrid-Level1/':
            totalQuestions = 25;

            break;
        case 'FormTheFace-Level1/':
            totalQuestions = 19;

            break;

        case 'NittyGritty/':
            totalQuestions = 45;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;


        case 'JackInTheBox-Level1/':
            totalQuestions = 20;

            break;

        case 'PhotoShop-Level1/':
            totalQuestions = 39;

            break;

        case 'OutOfFocus-Level1/':
            totalQuestions = 20;
            break;

        case 'UnLockTheSuitcase-Level1/':
            totalQuestions = 20;
            break;

        case 'Capitonyms-Level1/':
            totalQuestions = 51;
            break;
        case 'ObjectMemory-Level1/':
            totalQuestions = 20;
            break;
        case 'ObjectMemory-LKG/':
            totalQuestions = 20;
            break;
        case 'ObjectMemory-UKG/':
            totalQuestions = 20;
            break;
        case 'AnimalTravel-Level1/':
            totalQuestions = 20;
            break;
        case 'ChessBoard-Level1/':
            totalQuestions = 20;
            break;
        case 'ColorSpot-Level1/':
            totalQuestions = 40;
            break;
        case 'JungleSpot-Level1/':
            totalQuestions = 20;
            break;
            //===========================================SBC ENDS=======================================//  
            //===========================================Grade8 Starts=======================================//        
        case 'AnalogyAction-Level3/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;
        case 'BallAndBox-Level2/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;
        case 'BugSpot-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;
        case 'ChooseThreeToMakeOne-Level2/':
            totalQuestions = 25;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)

            qno.push(0)
            break;

        case 'ColorInColor-Level2/':
            totalQuestions = 25;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ConfusionGalore-Level2/':
            totalQuestions = 41;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'CoordinateGraph-Level2/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'DarkLight-Level6/':

            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonLight-Level6/':

            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DiscretePaddle-Level3/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'DividedWords-Level2/':
            totalQuestions = 10;


            break;
        case 'DropBox-Level2/':
            totalQuestions = 39;

            qno = []
            for (i = 0; i < 40; i++) {
                qno.push(i);
            }
            break;

        case 'LightRays-Level1/':
            totalQuestions = 12;

            break;

        case 'Equate-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'FlipTrick-Level2/':
            totalQuestions = 50;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'FormTheSquare-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'GuessTheWord-Level2/':
            totalQuestions = 50;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'VennDiagram-Level1/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'HomoPhones-Level2/':
            totalQuestions = 37;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'JumbledLetters-Level2/':
            totalQuestions = 50;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LogicalSequence/':
            totalQuestions = 50;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MasterVenn-Level2/':
            totalQuestions = 44;

            break;

        case 'MirrorImage-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'MisplacedBuddy-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'NumberMe-Level2/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'NumberPuzzle-Level3/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'NumbersOnTheVertices-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno[i + 60] = i + 60
            }
            qno1 = between(15, 45)
            qno2 = between(12, 65)
            qno3 = between(60, 125)
            qno4 = between(10, 70);
            qno5 = between(10, 65)
            break;
        case 'OddBall-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'PrefixRootAndSuffix/':
            totalQuestions = 37;

            break;
        case 'Rebus-Level2/':
            totalQuestions = 40;

            break;
        case 'ReverseReading-Level5/':
            totalQuestions = 49;


            break;
        case 'ReflectionRead-Level5/':
            totalQuestions = 75;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'RootWords-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'RouteMemory-Level2/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceMemory-Level8/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ShapeRollers-Level4/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ShapeVsColorVsPattern-Level2/':
            totalQuestions = 20;
            qno = []
            posArr = []
            posArr1 = []
            posArr2 = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            posArr = [2, 1, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2]
            posArr1 = [2, 1, 2, 1, 1, 2, 1, 2, 1, 1]
            posArr2 = [2, 1, 2, 1, 1, 2, 1, 2, 1, 1]
            posArr.sort(randomSort)
            posArr1.sort(randomSort)
            posArr2.sort(randomSort)
            break;

        case 'Shopping-Level2/':
            totalQuestions = 37;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SpotMe-Level7/':
            totalQuestions = 33;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'SpotMyPlace-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'TakeTurns-Level4/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'WaterImage-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoIsNotThere-Level2/':
            totalQuestions = 10;

            break;

            //==================================================Grade8 Ends//=====================================================//
            //
            //
            //==================================================Grade7 Starts//=====================================================//
        case 'AnalogyAction-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;
        case 'BallAndBox-Level1/':
            totalQuestions = 17;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;

        case 'SpotTheOddOneOut-Level1/':
            totalQuestions = 19;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;




        case 'BugSpot-Level1/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;
        case 'ChooseTwoToMakeOne/':
            totalQuestions = 25;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ColorInColor-Level2/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ConfusionGalore-Level1/':
            totalQuestions = 38;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'CoordinateGraph-Level1/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DarkLight-Level5/':

            totalQuestions = 16;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DiscretePaddle-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DividedWords-Level1/':
            totalQuestions = 10;


            break;
        case 'DropBox-Level1/':
            totalQuestions = 39;

            qno = []
            for (i = 0; i < 40; i++) {
                qno.push(i);
            }
            break;
        case 'Equate-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'FlipTrick-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FormTheSquare-Level1/':
            totalQuestions = 40;

            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ColorInColor-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'GuessTheWord-Level1/':
            totalQuestions = 50;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Homophones-Level1/':
            totalQuestions = 38;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'JumbledLetters-Level1/':
            totalQuestions = 48;

            qno = []
            for (i = 0; i < 49; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            break;

        case 'KangarooWords/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MasterVenn-Level1/':
            totalQuestions = 47;


            break;

        case 'MirrorImage-Level1/':
            totalQuestions = 48;

            break;

        case 'MisplacedBuddy-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumberMe-Level1/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumberPuzzle-Level2/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumbersOnTheVertices-Level1/':
            totalQuestions = 30;

            qno = between(80, 125);
            qno1 = between(1, 40)
            qno2 = between(1, 30)
            break;

        case 'OddBall-Level1/':
            totalQuestions = 14;
            break;


        case 'Rebus-Level1/':
            totalQuestions = 39;

            break;

        case 'ReverseReading-Level4/':
            totalQuestions = 48;


            break;

        case 'ReflectionRead-Level4/':
            totalQuestions = 75;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'RootWords-Level1/':
            totalQuestions = 38;
            qno = []
            for (i = 0; i < 39; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(9), 1)
            break;

        case 'RouteMemory-Level1/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceMemory-Level7/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ShapeRollers-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ShapeVsColorVsPattern-Level1/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }


            break;

        case 'Shopping-Level1/':
            totalQuestions = 28;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SpotMe-Level6/':
            totalQuestions = 33;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'SpotMyPlace-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'TakeTurns-Level3/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WaterImage-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoIsNotThere-Level1/':
            totalQuestions = 10;

            break;

            //==================================================Grade7 Ends//=====================================================//
            //
            //
            //==================================================Grade6 Starts//=====================================================//
        case 'AlphaNumericEncode-Level6/':
            totalQuestions = 30;
            break;

        case 'AnalogyAction-Level1/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ArrangeTheWords-Level5/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-DolchWords/':
            totalQuestions = 13;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-FourLetterWord/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Geography/':
            totalQuestions = 19;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Jobs/':
            totalQuestions = 24;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Military/':
            totalQuestions = 14;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-People/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LetterJigsaw-Level4/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'AnimalWatch-Level1/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'AnimalWatch-Level2/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BackTrack-Level3/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < 18; i++) {
                qno.push(i);
            }
            break;

        case 'CarPark-Level4/':
            totalQuestions = 10;
            break;

        case 'CubeSherlock-Level2/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DarkLight-Level4/':
            totalQuestions = 14;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DeepUnder-Level4/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DiscretePadle-Level1/':
            totalQuestions = 30;
            break;

        case 'DiscretePaddle-Level1/':
            totalQuestions = 30;
            break;


        case 'FindTheTwins-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'GraphDecoder/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'IAmCube-Level2/':
            totalQuestions = 24;

            break;



        case 'MemoryCheck-Level6/':
            totalQuestions = 50;
            break;

        case 'MindCapture-Level6/':
            totalQuestions = 30;
            break;

        case 'MirrorMatch-Level4/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MissingLetter-Level4/':
            totalQuestions = 55;
            qno = []
            for (i = 0; i < 55; i++) {
                qno.push(i);
            }
            break;

        case 'MissingPiece-Level4/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NumberPuzzle-Level1/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;

        case 'NumbersOnTheWheel-Level6/':
            totalQuestions = 30;

            break;

        case 'ParaMaster-Level6/':
            totalQuestions = 30;
            break;

        case 'Rainbow-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ReflectionRead-Level3/':
            totalQuestions = 60;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'Reshuffle-Level6/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ReverseReading-Level3/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceGrid/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < 95; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceMemory-Level6/':
            totalQuestions = 30;
            break;

        case 'ShapeRollers-Level2/':
            totalQuestions = 50;
            break;

        case 'ShapeVsColor/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SmartRider/':
            totalQuestions = 30;
            break;

        case 'TakeTurns-Level2/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SpotMe-Level5/':
            totalQuestions = 34;
            break;

        case 'CycleRace-Level6/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
            //==================================================Grade6 Ends//=====================================================//
            //
            //
            //==================================================Grade5 Starts//=====================================================//
        case 'AlphaNumericEncode-Level5/':
            totalQuestions = 30;
            break;

        case 'Anagrams-HouseHold/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Sports/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Weather/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-CountryNames/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Schools/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;



        case 'ArrangeTheWords-Level4/':
            totalQuestions = 25;
            qno = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100]
            break;
        case 'ATeddyForATeddy-Level3/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BackTrack-Level2/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < 18; i++) {
                qno.push(i);
            }
            break;

        case 'CarPark-Level3/':
            totalQuestions = 10;
            break;

        case 'ColorGuess/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CubeSherlock-Level1/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DarkLight-Level3/':
            totalQuestions = 11;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonLight-Level3/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DeepUnder-Level3/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'FindTheTwins-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'FitMeRight-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'HueCram/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'IAmCube-Level1/':
            totalQuestions = 49;

            break;


        case 'LastLegend-Level5/':
            totalQuestions = 24;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MemoryCheck-Level5/':
            totalQuestions = 30;
            break;

        case 'MindCapture-Level5/':
            totalQuestions = 30;

            break;

        case 'MirrorMatch-Level3/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MissingLetter-Level1-SBC1/':
            totalQuestions = 50;
            break;

        case 'MissingLetter-Level3/':
            totalQuestions = 50;

            break;

        case 'MissingPiece-Level3/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NumberPuzzle-Level1/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            for (i = 0; i < 20; i++) {
                if (i < 10) {
                    qno1.push(i)
                } else {
                    qno1.push(i - 10)
                }
            }
            break;

        case 'NumbersOnTheWheel-Level5/':
            totalQuestions = 30;

            break;

        case 'ParaMaster-Level5/':
            totalQuestions = 30;
            break;

        case 'Rainbow-Level1/':
            totalQuestions = 30;
            break;

        case 'ReflectionRead-Level2/':
            totalQuestions = 60;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Reshuffle-Level5/':
            totalQuestions = 30;
            break;

        case 'ReverseReading-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceMemory-Level5/':
            totalQuestions = 30;
            break;

        case 'ShapeRollers-Level1/':
            totalQuestions = 50;
            break;

        case 'SpotMe-Level4/':
            totalQuestions = 25;

            break;

        case 'WordStem/':
            totalQuestions = 19;
            qno.splice(qno.indexOf(5), 1)
            qno.push(5)
            break;

        case 'TakeTurns-Level1':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhatsInStore-Level3/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'CycleRace-Level5/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

            //==================================================Grade5 Ends//=====================================================//
            //
            //
            //
            //=================================================Grade4 Starts====================================================//        
        case 'AlphaNumericEncode-Level4/':
            totalQuestions = 30;
            break;

        case 'Anagrams-Food/':
            totalQuestions = 23;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Math/':
            totalQuestions = 20;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;

        case 'Anagrams-Plants/':
            totalQuestions = 20;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;



        case 'AnimalWipe/':
            totalQuestions = 19;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ArrangeTheWords-Level3/':
            totalQuestions = 30;
            break;

        case 'ATeddyForATeddy-Level2/':

            totalQuestions = 50;
            qno = []
            for (i = 1; i <= totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BackTrack-Level1/':
            totalQuestions = 15;

            qno = []
            for (i = 0; i < 18; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonBurst-Level4/':
            totalQuestions = 10;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;


        case 'BalloonBurst-A1/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonBurst-A2/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CarPark-Level2/':
            totalQuestions = 10;
            break;

        case 'CharacterShade-Level4/':
            totalQuestions = 100;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DarkLight-Level2/':
            totalQuestions = 10;
            break;

        case 'DeepUnder-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'FindTheTwins-Level1/':
            totalQuestions = 30;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'FitMeRight-Level1/':
            totalQuestions = 40;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;



        case 'LastLegend-Level4/':
            totalQuestions = 24;

            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MemoryCheck-Level4/':
            totalQuestions = 30;

            break;

        case 'MindCapture-Level4/':
            totalQuestions = 30;
            break;

        case 'MirrorMatch-Level2/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MissingLetter-Level2/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MissingPiece-Level2/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NameLand-Level2/':
            totalQuestions = 10;
            break;

        case 'NumberJigsaw-Level4/':
            totalQuestions = 30;
            break;

        case 'NumberSeries-Level2/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'NumbersOnTheWheel-Level4/':
            totalQuestions = 30;
            break;

        case 'ParaMaster-Level4/':
            totalQuestions = 30;
            break;

        case 'ReflectionRead-Level1/':
            totalQuestions = 60;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Reshuffle-Level4/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i + 100);
            }
            break;

        case 'ReverseReading-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SequenceMemory-Level4/':
            totalQuestions = 25;
            break;

        case 'WhatsInStore-Level2/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoAmI-Flowers/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WordShapes-Level4/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WordWalls-Level2/':
            totalQuestions = 31;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'CycleRace-Level4/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
            //==================================================Grade4 Ends//=====================================================//
            //
            //
            //=================================================Grade3 Starts====================================================//
        case 'AddMaster-Level3/':
            totalQuestions = 30;
            break;

        case 'AlphaNumericEncode-Level3/':
            totalQuestions = 30;
            break;

        case 'Anagrams-Animals/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Body/':
            totalQuestions = 18;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Clothes/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Colors/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Anagrams-Vehicles/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ArrangeTheWords-Level2/':
            totalQuestions = 25;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ATeddyForATeddy-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonBurst-Level3/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CarPark-Level1/':
            totalQuestions = 10;
            break;

        case 'CharacterShade-Level3/':
            totalQuestions = 100;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DarkLight-Level1/':
            totalQuestions = 20;
            break;

        case 'DeepUnder-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DialAnumber/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'EdCells-Level3/':
            totalQuestions = 79;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'EyeCells-Level3/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Hand2Hand/':
            totalQuestions = 29;

            break;



        case 'LastLegend-Level3/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LetterJigsaw-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MatchMe-Level3/':
            totalQuestions = 10;

            break;

        case 'MemoryCheck-Level3/':
            totalQuestions = 30;
            break;

        case 'MindCapture-Level3/':
            totalQuestions = 30;
            break;

        case 'MirrorMatch-Level1/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MissingPiece-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NameLand-Level1/':
            totalQuestions = 14;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumberJigsaw-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumberSeries-Level1/':
            totalQuestions = 39;
            break;

        case 'ObjectSpell-Level2/':
            totalQuestions = 18;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumbersOnTheWheel-Level3/':
            totalQuestions = 30;

            break;
        case 'JustNotHalf-Level1/':
            totalQuestions = 36;

            break;
        case 'JustNotHalf-Level2/':
            totalQuestions = 36;

            break;

        case 'JustNotHalf-Level3/':
            totalQuestions = 36;
            break;
        case 'JustNotHalf-Level4/':
            totalQuestions = 36;

            break;


        case 'ParaMaster-Level3/':
            totalQuestions = 30;
            break;

        case 'Reshuffle-Level3/':
            totalQuestions = 30;
            break;

        case 'SequenceMemory-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhatsInStore-Level1/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoAmI-Birthday/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WordShapes-Level3/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'WordWalls-Level1/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)

            break;

            //==================================================Grade3 Ends//=====================================================//
            //
            //
            //=================================================Grade2 Starts====================================================//
        case 'AddMaster-Level2/':
            totalQuestions = 17;
            // picnos = between(0, 16)
            break;

        case 'AlphaNumberRead/':
            totalQuestions = 14;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'AlphaNumericEncode-Level2/':
            totalQuestions = 30;

            break;

        case 'AnimalSpell/':
            totalQuestions = 23;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'ArrangeTheWords-Level1/':
            totalQuestions = 29;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BalloonBurst-Level2/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BestFit-Level4/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CharacterShade-Level2/':
            totalQuestions = 30;
            break;

        case 'ClockArithmetic/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'DownUnder-Level2/':
            totalQuestions = 25;

            break;

        case 'EdCells-Level2/':
            totalQuestions = 13;

            break;

        case 'EyeCells-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Face2Face-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'Fishing/':
            totalQuestions = 14;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'HeavyOrLight-Level2/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LastLegend-Level2/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LetterJigsaw-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MatchMe-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'MemoryCheck-Level2/':
            totalQuestions = 30;
            break;

        case 'MindCapture-Level2/':
            totalQuestions = 30;
            break;

        case 'NumberDecode-Level2/':
            totalQuestions = 20;
            break;

        case 'NumberJigsaw-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumbersOnTheWheel-Level2/':
            totalQuestions = 30;

            break;

        case 'ObjectSpell-Level1/':
            totalQuestions = 22;

            break;

        case 'ParaMaster-Level2/':
            totalQuestions = 30;
            break;

        case 'Reshuffle-Level2/':
            totalQuestions = 30;
            break;

        case 'SequenceMemory-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'SpotMe-Level2/':
            totalQuestions = 30;
            break;

        case 'StarLight-Level4/':
            totalQuestions = 18;

            break;

        case 'VowelMagic/':
            totalQuestions = 10;

            qno.splice(qno.indexOf(1), 1)
            qno.push(1)
            break;

        case 'WhatComesNext/':
            totalQuestions = 30;
            break;

        case 'WhoAmI_Clothes/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;

        case 'WhoAmI_Insects/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0);
            break;

        case 'WhoAmI_School/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoAmI_SeaAnimals/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoAmI_Transport/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhoAmI-WildAnimals/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WordShapes-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'WordWipe-Level2/':
            totalQuestions = 51;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BusRide-Level2/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ClockArithmetic/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CycleRace-Level2/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

            //==================================================Grade2 Ends//=====================================================//

            //=================================================Grade1 Starts====================================================//
        case 'AddMaster-Level1/':
            totalQuestions = 17;
            picnos = between(0, 9)
            break;

        case 'AlphaNumericEncode-Level1/':
            totalQuestions = 20;

            break;



        case 'BalloonBurst-Level1/':
            totalQuestions = 12;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'BestFit-Level3/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'CharacterShade-Level1/':
            totalQuestions = 26;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(18), 1)
            qno.push(18)
            break;

        case 'CompoundWords/':
            totalQuestions = 19;

            break;

        case 'DownUnder-Level1/':
            totalQuestions = 20;

            break;

        case 'EdCells-Level1/':
            totalQuestions = 35;
            qno = between(0, 35);
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno1 = between(0, 35);
            break;

        case 'EyeCells-Level1/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'EyeCells-Level2/':
            totalQuestions = 40;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'Face2Face-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'HeavyOrLight-Level1/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'LastLegend-Level1/':
            totalQuestions = 24;

            break;

        case 'LetterJigsaw-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }

            break;

        case 'MatchMe-Level1/':
            totalQuestions = 40;
            break;

        case 'MemoryCheck-Level1/':
            totalQuestions = 25;
            break;

        case 'MindCapture-Level1/':
            totalQuestions = 30;
            break;

        case 'MomAndMe/':
            totalQuestions = 16;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumberDecode-Level1/':
            totalQuestions = 20;
            break;

        case 'NumberJigsaw-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'NumbersOnTheWheel-Level1/':
            totalQuestions = 20;

            break;

        case 'NumbersOnTheWheel-A1/':
            totalQuestions = 10;

            break;


        case 'ObjectShade/':
            totalQuestions = 37;
            qno = []
            for (i = 0; i < 38; i++) {
                qno.push(i);
            }
            var inx = qno.indexOf(10)
            qno.splice(inx, 1)
            qno.splice(qno.indexOf(26), 1)
            qno.push(26)
            break;

        case 'ParaMaster-Level1/':
            totalQuestions = 30;
            break;

        case 'Reshuffle-Level1/':
            totalQuestions = 30;
            break;

        case 'SequenceMemory-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'StarLight-Level3/':
            totalQuestions = 15;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'StrangerGrid-Level3/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WhatComesNext/':
            totalQuestions = 25;
            break;

        case 'WhoAmI-Birds/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(4), 1)
            qno.push(4);
            break;

        case 'WhoAmI-HouseHoldThings/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(2), 1)
            qno.push(2)
            break;

        case 'WhoAmI-Colors/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(7), 1)
            qno.push(7);
            break;

        case 'WhoAmI-DomesticAnimals/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(1), 1)
            qno.push(1);
            break;

        case 'WhoAmI-Fruits/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0);
            break;

        case 'WhoAmI-Vegetables/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(5), 1)
            qno.push(5);
            break;
        case 'WhoAmI-Shapes/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(7), 1)
            qno.push(7);
            break;

        case 'WordShapes-Level1/':
            totalQuestions = 45;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'WordSpell-Level1/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'WordWipe-Level1/':
            totalQuestions = 50;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'BusRide-Level1/':
            totalQuestions = 20;

            break;

        case 'CycleRace-Level1/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;

        case 'CycleRace-Level3/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'SpotMe-Level1/':
            totalQuestions = 30;

            break;

        case 'SpotMe-Level3/':
            totalQuestions = 15;

            break;


            //==================================================Grade1 Ends//=====================================================//
            //==================================================NewGames //======================================================//

        case 'BasketBall-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'BasketBall-Level2/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'ColorMe/':
            totalQuestions = 20;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'MissingShapes-Level1/':
            totalQuestions = 30;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'BallTrack-Level1/':
            totalQuestions = 10;
            break;
        case 'FindMe/':
            totalQuestions = 20;
            break;
        case 'FindMyPair/':
            totalQuestions = 15;
            break;
        case 'MemoryMaster/':
            totalQuestions = 20;
            break;
        case 'DescendingOrder/':
            totalQuestions = 20;
            break;
        case 'BallShooter-Level1/':
            totalQuestions = 10;
            break;
        case 'BallBounce-Level1/':
            totalQuestions = 14;
            break;
        case 'DiceAddition-Level1/':
            totalQuestions = 20;
            break;
        case 'DiceAddition-Level2/':
            totalQuestions = 20;
            break;
        case 'Date-Level2/':
            totalQuestions = 20;
            break;

        case 'FindTheVertex/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'CrossWords/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'BallArrangement/':
            totalQuestions = 30;
            break;
        case 'FlippedImage-Level1/':
            totalQuestions = 30;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'MissingDots/':
            totalQuestions = 10
            break;
        case 'MasterShape-Level1/':
            totalQuestions = 14
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'MyGarage/':
            totalQuestions = 10;
            qno = []
            for (i = 0; i < totalQuestions; i++) {
                qno.push(i);
            }
            break;
        case 'Senses-Level2/':
            totalQuestions = 25;
            break;
        case 'TypeIt-Level1/':
            totalQuestions = 20;
            break;

        case 'LineSegment-Level2/':
            totalQuestions = 16
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'LineSegment-Level1/':
            totalQuestions = 16
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'LineSegment-Level3/':
            totalQuestions = 20
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'PartsOfTheBody-Level1/':
            totalQuestions = 12
            qno.splice(qno.indexOf(2), 1)
            qno.push(2)
            break;
        case 'PartsOfTheBody-Level2/':
            totalQuestions = 12
            qno.splice(qno.indexOf(2), 1)
            qno.push(2)
            break;

        case 'Tangrams/':
            totalQuestions = 20;
            break;
        case 'Planets/':
            totalQuestions = 16;
            break;
        case 'MoreLess/':
            totalQuestions = 20;
            break;
        case 'SpinWheel/':
            totalQuestions = 10;
            break;
        case 'Stranger-Level1/':
            totalQuestions = 18;
            break;
        case 'Stranger-Level2/':
            totalQuestions = 12;
            break;

            ///////////////////////////////////////////////////////SBC//////////////////////////////////////////
        case 'ArrowWatch-Level1/':
            totalQuestions = 15;
            break;
        case 'BubbleShift-UKG/':
            totalQuestions = 14;
            break;
        case 'BubbleShift-LKG/':
            totalQuestions = 10;
            break;
        case 'ItsNotMe-Level1/':
            totalQuestions = 10;
            break;
        case 'AnimalLeap-Level1/':
            totalQuestions = 15;
            break;
        case 'HippityHop-Level1/':
            totalQuestions = 15;
            break;
        case 'BubbleShift-Level1/':
            totalQuestions = 20;
            break;
        case 'AlienSmiley-Level1/':
            totalQuestions = 50;
            break;
        case 'FitIn-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'FitThePiece-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'RearMagic-Level1/':
            totalQuestions = 25;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'MotionMaster-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'TopView-Level1/':
            totalQuestions = 41;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'IconsInAction-Level1/':
            totalQuestions = 20;
            break;
        case 'Metaphors-Level1/':
            totalQuestions = 29;
            break;
        case 'MissingLetter-Level1/':
            totalQuestions = 50;
            break;
        case 'BeginToEnd-Level1/':
            totalQuestions = 60;
            break;
        case 'TwinVowels-Level1/':
            totalQuestions = 50;
            break;
        case 'ShapeShifters-Level1/':
            totalQuestions = 10;
            break;
        case 'ItsGlowing-Level1/':
            totalQuestions = 15;
            break;
        case 'ColorFix-Level1/':
            totalQuestions = 19;
            break;
        case 'MissingLetter-Level2-SBC1/':
            totalQuestions = 50;
            break;
        case 'Homographs-Level1/':
            totalQuestions = 50;
            break;
        case 'Homographs-Level1/':
            totalQuestions = 30;
            break;

        case 'HandAlphabet-Level1/':
            totalQuestions = 78;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NotAPair-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ShadowLights-Level1/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ShadowLights-LKG/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ShadowLights-UKG/':
            totalQuestions = 15;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

            ////////////////////////////////////////sbc -ps////////////////////////////////////////
        case 'ObjectSort-LKG/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'ObjectSort-UKG/':
            totalQuestions = 20;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'ObjectSort-Level1/':
            totalQuestions = 10;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'DecodeMe-Level1/':
            totalQuestions = 49;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'CardArithmetic-Level1/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
            //===========================================SBC Linguistics=======================================//  
        case 'PicturePreposition-Level1/':
            totalQuestions = 26;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'NameIt-Level1/':
            totalQuestions = 54;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'FracturedFraction-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'AddGuru-Level1/':
            totalQuestions = 42;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'FaceMask-Level1/':
            totalQuestions = 30;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'TrickyNumbers-Level1/':
            totalQuestions = 49;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'NumberPuzzle-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'VowelTrain-Level1/':
            totalQuestions = 49;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'VowelTrain-LKG/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'VowelTrain-UKG/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'JumbledLetter-Level1/':
            totalQuestions = 50;

            qno.splice(qno.indexOf(0), 1)
            qno.push(0)

            break;

        case 'FruitBalance-Level1/':
            totalQuestions = 40;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;

        case 'FormTheShape-Level1/':
            totalQuestions = 30;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;


        case 'TrickyNumbers-Level1/':
            totalQuestions = 49;
            break;

        case 'JumbledLetters-Level1/':
            totalQuestions = 49;
            break
        case 'VowelTrain-Level1/':
            totalQuestions = 50;
            qno.splice(qno.indexOf(0), 1)
            qno.push(0)
            break;
        case 'TeamUp-Level2/':
            totalQuestions = 23;

            break;

        default:
            //text = "I have never heard of that fruit...";
            // console.log("get outer= " + gameName)

    }
    removePlayedQues()

    time = 2000;
    //================================================End of Grade - 8 ====================================// 
    gameTimerTxt.text = parseInt(time);

}