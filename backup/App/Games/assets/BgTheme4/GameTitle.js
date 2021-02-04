var titleArr = ['AddGuru', 'AddMaster', 'AlienSmiley', 'AlphabetTrain', 'AlphaNumberRead', 'AlphaNumericEncode', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams',
    'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams', 'Anagrams-Sports', 'Anagrams-Vehicles',
    'Anagrams', 'Anagrams', 'AnalogyAction', 'AnimalLeap', 'AnimalSpell', 'AnimalTravel', 'AnimalWatch', 'AnimalWipe', 'ArithmeticChallenge', 'ArrangeTheWords', 'ArrowWatch',
    'ATeddyForATeddy', 'BackTrack', 'BallAndBox', 'BallArrangement', 'BallBounce', 'BalloonBurst', 'BalloonLight', 'BallShooter', 'BallTrack', 'BasketBall', 'BeginToEnd', 'BestFit', 'BubbleShift', 'BugSpot', 'BusRide', 'Capitonyms',
    'CardArithmetic', 'CarPark', 'CharacterShade', 'ChessBoard', 'ChooseThreeToMakeOne', 'ChooseTwoToMakeOne', 'ClockArithmetic', 'ClockGrid', 'ColorFix', 'ColorGuess', 'ColorInColor', 'ColorMe', 'ColorSpot', 'CompoundWords',
    'ConfusionGalore', 'CoordinateGraph', 'CrossWords', 'CubeSherlock', 'CycleRace', 'Date', 'DecodeMe', 'DeepUnder', 'DescendingOrder', 'DialAnumber', 'DiceAddition', 'DiscretePaddle', 'DividedWords', 'DownUnder', 'DropBox',
    'EdCells', 'Equate', 'EyeCells', 'Face2Face', 'FaceMask', 'FindMyPair', 'FindTheTwins', 'FindTheVertex', 'Fishing', 'FitIn', 'FitMeRight', 'FitThePiece', 'FlippedImage', 'FlipTrick', 'FormTheFace', 'FormTheShape',
    'FormTheSquare', 'FracturedFraction', 'FruitBalance', 'GraphDecoder', 'GuessTheWord', 'Hand2Hand', 'HandAlphabet', 'HeavyOrLight', 'HippityHop', 'Homographs', 'HomoPhones', 'HueCram', 'IAmCube', 'IClassify',
    'IconsInAction', 'ItsGlowing', 'ItsNotMe', 'JackInTheBox', 'JigsawPieces', 'JumbledLetter', 'JumbledLetters', 'JungleSpot', 'JustNotHalf', 'KangarooWords', 'LastLegend', 'LetterJigsaw', 'LightRays', 'LineSegment',
    'LogicalSequence', 'MagicalWords', 'MasterShape', 'MasterVenn', 'MatchMe', 'MemoryCheck', 'MemoryMaster', 'Metaphors', 'MindCapture', 'MirrorImage', 'MirrorMatch', 'MisplacedBuddy', 'MissingDots', 'MissingLetter',
    'MissingPiece', 'MissingShapes', 'MomAndMe', 'MoreLess', 'MotionMaster', 'MyGarage', 'NameIt', 'NameLand', 'NittyGritty', 'NotAPair', 'NumberDecode', 'NumberJigsaw', 'NumberMe', 'NumberPuzzle', 'NumberSeries',
    'NumbersOnTheVertices', 'NumbersOnTheWheel', 'ObjectMemory', 'ObjectShade', 'ObjectSort', 'ObjectSpell', 'OddBall', 'OutOfFocus', 'ParaMaster', 'PartsOfTheBody', 'PhotoShop', 'PictureJackpot', 'PictureNamePair',
    'PicturePreposition', 'Planets', 'PrefixRootAndSuffix', 'Rainbow', 'RearMagic', 'Rebus', 'ReflectionRead', 'RememberMyName', 'Reshuffle', 'ReverseReading', 'RootWords', 'RouteMemory', 'Senses', 'SequenceGrid', 'SequenceMemory',
    'ShadesOfMeaning', 'ShadowLights', 'ShapeRollers', 'ShapeShifters', 'ShapeVsColor', 'ShapeVsColorVsPattern', 'Shopping', 'SmartRider', 'SmileyCatch', 'SpinWheel', 'SpotMe', 'SpotMyPlace', 'SpotTheOddOneOut', 'StarLight', 'StrangerGrid',
    'Stranger', 'TakeTurns', 'Tangrams', 'TeamUp', 'TopView', 'TrickyNumbers', 'TwinVowels', 'TypeIt', 'UnLockTheSuitcase', 'VennDiagram', 'VowelMagic', 'VowelsInARow', 'VowelTrain', 'WaterImage', 'WhatComesNext', 'WhatsInStore',
    'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoAmI', 'WhoIsNotThere', 'WordShapes', 'WordSpell', 'WordStem', 'WordWalls', 'WordWipe',
    'Alternative', 'AreWeSame', 'AscendingOrder', 'BallPosition', 'Calendar', 'CarNumber', 'ChoosingShapes', 'CompleteMe', 'CrossWords', 'DiscoverMe', 'DropMe', 'FindTheCar', 'FindTheEdges', 'FindTheFaces', 'LineSegment', 'MatchTheCount', 'MoreOrLess',
    'NumberMe', 'OddGroup', 'OddObject', 'OddOneOut', 'PlayTheDrums', 'RhymingWords', 'SensoryWords', 'ShadowMatch', 'ShadowWar', 'ShapeBreak', 'Sorting', 'WhatsMyColor', 'WhereIBelong', 'WhereIBelong', 'WhereItBelongs'];

var titleValue = 0;
function createTitleBtn() {

    titleValue = titleArr.indexOf(GameName);
    if (titleValue < 100) {
        TitleBtn = TitleBtn1.clone();
    } else if (titleValue > 99 && titleValue < 200) {
        TitleBtn = TitleBtn2.clone();

    } else if (titleValue > 199 && titleValue < 350) {
        TitleBtn = TitleBtn3.clone();
    }
    console.log("GameName...................= " + titleArr.indexOf(GameName));
    console.log("GameName= " + GameName);

    switch (GameName) {

        case 'AddGuru':
            TitleBtn.gotoAndStop(0);
            break;
        case 'AddMaster':
            TitleBtn.gotoAndStop(1);
            break;
        case 'AlienSmiley':
            TitleBtn.gotoAndStop(2);
            break;
        case 'AlphabetTrain':
            TitleBtn.gotoAndStop(3);
            break;
        case 'AlphaNumberRead':
            TitleBtn.gotoAndStop(4);
            break;
        case 'AlphaNumericEncode':
            TitleBtn.gotoAndStop(5);
            break;
        case 'Anagrams':
            if (GameNameWithLvl == 'Anagrams-Animals') {
                TitleBtn.gotoAndStop(6);
            } else if (GameNameWithLvl == 'Anagrams-Body') {
                TitleBtn.gotoAndStop(7);
            } else if (GameNameWithLvl == 'Anagrams-Clothes') {
                TitleBtn.gotoAndStop(8);
            } else if (GameNameWithLvl == 'Anagrams-Colors') {
                TitleBtn.gotoAndStop(9);
            } else if (GameNameWithLvl == 'Anagrams-CountryNames') {
                TitleBtn.gotoAndStop(10);
            } else if (GameNameWithLvl == 'Anagrams-DolchWords') {
                TitleBtn.gotoAndStop(11);
            } else if (GameNameWithLvl == 'Anagrams-Food') {
                TitleBtn.gotoAndStop(12);
            } else if (GameNameWithLvl == 'Anagrams-FourLetterWord') {
                TitleBtn.gotoAndStop(13);
            } else if (GameNameWithLvl == 'Anagrams-Geography') {
                TitleBtn.gotoAndStop(14);
            } else if (GameNameWithLvl == 'Anagrams-HouseHold') {
                TitleBtn.gotoAndStop(15);
            } else if (GameNameWithLvl == 'Anagrams-Jobs') {
                TitleBtn.gotoAndStop(16);
            } else if (GameNameWithLvl == 'Anagrams-Math') {
                TitleBtn.gotoAndStop(18);
            } else if (GameNameWithLvl == 'Anagrams-Military') {
                TitleBtn.gotoAndStop(19);
            } else if (GameNameWithLvl == 'Anagrams-People') {
                TitleBtn.gotoAndStop(20);
            } else if (GameNameWithLvl == 'Anagrams-Plants') {
                TitleBtn.gotoAndStop(21);
            } else if (GameNameWithLvl == 'Anagrams-Schools') {
                TitleBtn.gotoAndStop(22);
            } else if (GameNameWithLvl == 'Anagrams-Sports') {
                TitleBtn.gotoAndStop(23);
            } else if (GameNameWithLvl == 'Anagrams-Vehicles') {
                TitleBtn.gotoAndStop(24);
            } else if (GameNameWithLvl == 'Anagrams-Weather') {
                TitleBtn.gotoAndStop(25);
            } else {
                TitleBtn.gotoAndStop(17);
            }
            break;
        case 'AnalogyAction':
            TitleBtn.gotoAndStop(26);
            break;
        case 'AnimalLeap':
            TitleBtn.gotoAndStop(27);
            break;
        case 'AnimalSpell':
            TitleBtn.gotoAndStop(28);
            break;
        case 'AnimalTravel':
            TitleBtn.gotoAndStop(29);
            break;
        case 'AnimalWatch':
            TitleBtn.gotoAndStop(30);
            break;
        case 'AnimalWipe':
            TitleBtn.gotoAndStop(31);
            break;
        case 'ArithmeticChallenge':
            TitleBtn.gotoAndStop(32);
            break;
        case 'ArrangeTheWords':
            TitleBtn.gotoAndStop(33);
            break;
        case 'ArrowWatch':
            TitleBtn.gotoAndStop(34);
            break;
        case 'ATeddyForATeddy':
            TitleBtn.gotoAndStop(35);
            break;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case 'BackTrack':
            TitleBtn.gotoAndStop(36);
            break;
        case 'BallAndBox':
            TitleBtn.gotoAndStop(37);
            break;
        case 'BallArrangement':
            TitleBtn.gotoAndStop(38);
            break;
        case 'BallBounce':
            TitleBtn.gotoAndStop(39);
            break;
        case 'BalloonBurst':
            TitleBtn.gotoAndStop(40);
            break;
        case 'BalloonLight':
            TitleBtn.gotoAndStop(41);
            break;
        case 'BallShooter':
            TitleBtn.gotoAndStop(42);
            break;
        case 'BallTrack':
            TitleBtn.gotoAndStop(43);
            break;
        case 'BasketBall':
            TitleBtn.gotoAndStop(44);
            break;
        case 'BeginToEnd':
            TitleBtn.gotoAndStop(45);
            break;
        case 'BestFit':
            TitleBtn.gotoAndStop(46);
            break;
        case 'BubbleShift':
            TitleBtn.gotoAndStop(47);
            break;

        case 'BugSpot':
            TitleBtn.gotoAndStop(48);
            break;
        case 'BusRide':
            TitleBtn.gotoAndStop(49);
            break;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Capitonyms':
            TitleBtn.gotoAndStop(50);
            break;
        case 'CardArithmetic':
            TitleBtn.gotoAndStop(51);
            break;
        case 'CarPark':
            TitleBtn.gotoAndStop(52);
            break; Sh
        case 'CharacterShade':
            TitleBtn.gotoAndStop(53);
            break;
        case 'ChessBoard':
            TitleBtn.gotoAndStop(54);
            break;

        case 'ChooseThreeToMakeOne':
            TitleBtn.gotoAndStop(55);
            break;
        case 'ChooseTwoToMakeOne':
            TitleBtn.gotoAndStop(56);
            break;
        case 'ClockArithmetic':
            TitleBtn.gotoAndStop(57);
            break;
        case 'ClockGrid':
            TitleBtn.gotoAndStop(58);
            break;
        case 'ColorFix':
            TitleBtn.gotoAndStop(59);
            break;
        case 'ColorGuess':
            TitleBtn.gotoAndStop(60);
            break;
        case 'ColorInColor':
            TitleBtn.gotoAndStop(61);
            break;
        case 'ColorMe':
            TitleBtn.gotoAndStop(62);
            break;
        case 'ColorSpot':
            TitleBtn.gotoAndStop(63);
            break;
        case 'CompoundWords':
            TitleBtn.gotoAndStop(64);
            break;
        case 'ConfusionGalore':
            TitleBtn.gotoAndStop(65);
            break;
        case 'CoordinateGraph':
            TitleBtn.gotoAndStop(66);
            break;
        case 'CrossWords':
            TitleBtn.gotoAndStop(67);
            break;
        case 'CubeSherlock':
            TitleBtn.gotoAndStop(68);
            break;
        case 'CycleRace':
            TitleBtn.gotoAndStop(69);
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Date':
            TitleBtn.gotoAndStop(70);
            break;
        case 'DecodeMe':
            TitleBtn.gotoAndStop(71);
            break;
        case 'DeepUnder':
            TitleBtn.gotoAndStop(72);
            break;
        case 'DescendingOrder':
            TitleBtn.gotoAndStop(73);
            break;
        case 'DialAnumber':
            TitleBtn.gotoAndStop(74);
            break;
        case 'DiceAddition':
            TitleBtn.gotoAndStop(75);
            break;
        case 'DiscretePaddle':
            TitleBtn.gotoAndStop(76);
            break;
        case 'DividedWords':
            TitleBtn.gotoAndStop(77);
            break;
        case 'DownUnder':
            TitleBtn.gotoAndStop(78);
            break;
        case 'DropBox':
            TitleBtn.gotoAndStop(79);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'EdCells':
            TitleBtn.gotoAndStop(80);
            break;
        case 'Equate':
            TitleBtn.gotoAndStop(81);
            break;
        case 'EyeCells':
            TitleBtn.gotoAndStop(82);
            break;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Face2Face':
            TitleBtn.gotoAndStop(83);
            break;
        case 'FaceMask':
            TitleBtn.gotoAndStop(84);
            break;
        case 'FindMe':
            TitleBtn.gotoAndStop(85);
            break;
        case 'FindMyPair':
            TitleBtn.gotoAndStop(86);
            break;
        case 'FindTheTwins':
            TitleBtn.gotoAndStop(87);
            break;
        case 'FindTheVertex':
            TitleBtn.gotoAndStop(88);
            break;
        case 'Fishing':
            TitleBtn.gotoAndStop(89);
            break;
        case 'FitIn':
            TitleBtn.gotoAndStop(90);
            break;
        case 'FitMeRight':
            TitleBtn.gotoAndStop(91);
            break;
        case 'FitThePiece':
            TitleBtn.gotoAndStop(92);
            break;
        case 'FlippedImage':
            TitleBtn.gotoAndStop(93);
            break;
        case 'FlipTrick':
            TitleBtn.gotoAndStop(94);
            break;
        case 'FormTheFace':
            TitleBtn.gotoAndStop(95);
            break;
        case 'FormTheShape':
            TitleBtn.gotoAndStop(96);
            break;
        case 'FormTheSquare':
            TitleBtn.gotoAndStop(97);
            break;
        case 'FracturedFraction':
            TitleBtn.gotoAndStop(98);
            break;
        case 'FruitBalance':
            TitleBtn.gotoAndStop(99);
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'GraphDecoder':
            TitleBtn.gotoAndStop(0);
            break;
        case 'GuessTheWord':
            TitleBtn.gotoAndStop(1);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Hand2Hand':
            TitleBtn.gotoAndStop(2);
            break;
        case 'HandAlphabet':
            TitleBtn.gotoAndStop(3);
            break;
        case 'HeavyOrLight':
            TitleBtn.gotoAndStop(4);
            break;
        case 'HippityHop':
            TitleBtn.gotoAndStop(5);
            break;

        case 'Homographs':
            TitleBtn.gotoAndStop(6);
            break;
        case 'HomoPhones':
            TitleBtn.gotoAndStop(7);
            break;
        case 'HueCram':
            TitleBtn.gotoAndStop(8);
            break;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'IAmCube':
            TitleBtn.gotoAndStop(9);
            break;
        case 'IClassify':
            TitleBtn.gotoAndStop(10);
            break;
        case 'IconsInAction':
            TitleBtn.gotoAndStop(11);
            break;
        case 'ItsGlowing':
            TitleBtn.gotoAndStop(12);
            break;
        case 'ItsNotMe':
            TitleBtn.gotoAndStop(13);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'JackInTheBox':
            TitleBtn.gotoAndStop(14);
            break;
        case 'JigsawPieces':
            TitleBtn.gotoAndStop(15);
            break;
        case 'JumbledLetter':
            TitleBtn.gotoAndStop(16);
            break;
        case 'JumbledLetters':
            TitleBtn.gotoAndStop(17);
            break;
        case 'JungleSpot':
            TitleBtn.gotoAndStop(18);
            break;
        case 'JustNotHalf':
            TitleBtn.gotoAndStop(19);
            break;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'KangarooWords':
            TitleBtn.gotoAndStop(20);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'LastLegend':
            TitleBtn.gotoAndStop(21);
            break;
        case 'LetterJigsaw':
            TitleBtn.gotoAndStop(22);
            break;
        case 'LightRays':
            TitleBtn.gotoAndStop(23);
            break;
        case 'LineSegment':
            TitleBtn.gotoAndStop(24);
            break;
        case 'LogicalSequence':
            TitleBtn.gotoAndStop(25);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'MagicalWords':
            TitleBtn.gotoAndStop(26);
            break;
        case 'MasterShape':
            TitleBtn.gotoAndStop(27);
            break;
        case 'MasterVenn':
            TitleBtn.gotoAndStop(28);
            break;
        case 'MatchMe':
            TitleBtn.gotoAndStop(29);
            break;
        case 'MemoryCheck':
            TitleBtn.gotoAndStop(30);
            break;
        case 'MemoryMaster':
            TitleBtn.gotoAndStop(31);
            break;
        case 'Metaphors':
            TitleBtn.gotoAndStop(32);
            break;
        case 'MindCapture':
            TitleBtn.gotoAndStop(33);
            break;
        case 'MirrorImage':
            TitleBtn.gotoAndStop(34);
            break;
        case 'MirrorMatch':
            TitleBtn.gotoAndStop(35);
            break;
        case 'MisplacedBuddy':
            TitleBtn.gotoAndStop(36);
            break;
        case 'MissingDots':
            TitleBtn.gotoAndStop(37);
            break;
        case 'MissingLetter':
            TitleBtn.gotoAndStop(38);
            break;
        case 'MissingPiece':
            TitleBtn.gotoAndStop(39);
            break;
        case 'MissingShapes':
            TitleBtn.gotoAndStop(40);
            break;
        case 'MomAndMe':
            TitleBtn.gotoAndStop(41);
            break;
        case 'MoreLess':
            TitleBtn.gotoAndStop(42);
            break;
        case 'MotionMaster':
            TitleBtn.gotoAndStop(43);
            break;
        case 'MyGarage':
            TitleBtn.gotoAndStop(44);
            break;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'NameIt':
            TitleBtn.gotoAndStop(45);
            break;
        case 'NameLand':
            TitleBtn.gotoAndStop(46);
            break;
        case 'NittyGritty':
            TitleBtn.gotoAndStop(47);
            break;
        case 'NotAPair':
            TitleBtn.gotoAndStop(48);
            break;
        case 'NumberDecode':
            TitleBtn.gotoAndStop(49);
            break;
        case 'NumberJigsaw':
            TitleBtn.gotoAndStop(50);
            break;
        case 'NumberMe':
            TitleBtn.gotoAndStop(51);
            break;
        case 'NumberPuzzle':
            TitleBtn.gotoAndStop(52);
            break;
        case 'NumberSeries':
            TitleBtn.gotoAndStop(53);
            break;
        case 'NumbersOnTheVertices':
            TitleBtn.gotoAndStop(54);
            break;
        case 'NumbersOnTheWheel':
            TitleBtn.gotoAndStop(55);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'ObjectMemory':
            TitleBtn.gotoAndStop(56);
            break;
        case 'ObjectShade':
            TitleBtn.gotoAndStop(57);
            break;
        case 'ObjectSort':
            TitleBtn.gotoAndStop(58);
            break;
        case 'ObjectSpell':
            TitleBtn.gotoAndStop(59);
            break;
        case 'OddBall':
            TitleBtn.gotoAndStop(60);
            break;
        case 'OutOfFocus':
            TitleBtn.gotoAndStop(61);
            break;
        case 'ParaMaster':
            TitleBtn.gotoAndStop(62);
            break;
        case 'PartsOfTheBody':
            TitleBtn.gotoAndStop(63);
            break;
        case 'PhotoShop':
            TitleBtn.gotoAndStop(64);
            break;
        case 'PictureJackpot':
            TitleBtn.gotoAndStop(65);
            break;
        case 'PictureNamePair':
            TitleBtn.gotoAndStop(66);
            break;
        case 'PicturePreposition':
            TitleBtn.gotoAndStop(67);
            break;
        case 'Planets':
            TitleBtn.gotoAndStop(68);
            break;
        case 'PrefixRootAndSuffix':
            TitleBtn.gotoAndStop(69);
            break;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Rainbow':
            TitleBtn.gotoAndStop(70);
            break;
        case 'RearMagic':
            TitleBtn.gotoAndStop(71);
            break;
        case 'Rebus':
            TitleBtn.gotoAndStop(72);
            break;
        case 'ReflectionRead':
            TitleBtn.gotoAndStop(73);
            break;
        case 'RememberMyName':
            TitleBtn.gotoAndStop(74);
            break;
        case 'Reshuffle':
            TitleBtn.gotoAndStop(75);
            break;
        case 'ReverseReading':
            TitleBtn.gotoAndStop(76);
            break;
        case 'RootWords':
            TitleBtn.gotoAndStop(77);
            break;
        case 'RouteMemory':
            TitleBtn.gotoAndStop(78);
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'Senses':
            TitleBtn.gotoAndStop(79);
            break;
        case 'SequenceGrid':
            TitleBtn.gotoAndStop(80);
            break;
        case 'SequenceMemory':
            TitleBtn.gotoAndStop(81);
            break;
        case 'ShadesOfMeaning':
            TitleBtn.gotoAndStop(82);
            break;
        case 'ShadowLights':
            TitleBtn.gotoAndStop(83);
            break;
        case 'ShapeRollers':
            TitleBtn.gotoAndStop(84);
            break;
        case 'ShapeShifters':
            TitleBtn.gotoAndStop(85);
            break;
        case 'ShapeVsColor':
            TitleBtn.gotoAndStop(86);
            break;
        case 'ShapeVsColorVsPattern':
            TitleBtn.gotoAndStop(87);
            break;
        case 'Shopping':
            TitleBtn.gotoAndStop(88);
            break;
        case 'SmartRider':
            TitleBtn.gotoAndStop(89);
            break;
        case 'SmileyCatch':
            TitleBtn.gotoAndStop(90);
            break;
        case 'SpinWheel':
            TitleBtn.gotoAndStop(91);
            break;
        case 'SpotMe':
            TitleBtn.gotoAndStop(92);
            break;
        case 'SpotMyPlace':
            TitleBtn.gotoAndStop(93);
            break;
        case 'SpotTheOddOneOut':
            TitleBtn.gotoAndStop(94);
            break;
        case 'StarLight':
            TitleBtn.gotoAndStop(95);
            break;
        case 'StrangerGrid':
            TitleBtn.gotoAndStop(96);
            break;
        case 'Stranger':
            TitleBtn.gotoAndStop(97);
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'TakeTurns':
            TitleBtn.gotoAndStop(98);
            break;
        case 'Tangrams':
            TitleBtn.gotoAndStop(99);
            break;
        case 'TeamUp':
            TitleBtn.gotoAndStop(0);
            break;
        case 'TopView':
            TitleBtn.gotoAndStop(1);
            break;
        case 'TrickyNumbers':
            TitleBtn.gotoAndStop(2);
            break;
        case 'TwinVowels':
            TitleBtn.gotoAndStop(3);
            break;
        case 'TypeIt':
            TitleBtn.gotoAndStop(4);
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'UnLockTheSuitcase':
            TitleBtn.gotoAndStop(5);
            break;

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'VennDiagram':
            TitleBtn.gotoAndStop(6);
            break;
        case 'VowelMagic':
            TitleBtn.gotoAndStop(7);
            break;
        case 'VowelsInARow':
            TitleBtn.gotoAndStop(8);
            break;
        case 'VowelTrain':
            TitleBtn.gotoAndStop(9);
            break;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case 'WaterImage':
            TitleBtn.gotoAndStop(10);
            break;
        case 'WhatComesNext':
            TitleBtn.gotoAndStop(11);
            break;
        case 'WhatsInStore':
            TitleBtn.gotoAndStop(12);
            break;

        case 'WhoAmI':
            if (GameNameWithLvl == 'WhoAmI-School') {
                TitleBtn.gotoAndStop(13);
            } else if (GameNameWithLvl == 'WhoAmI-SeaAnimals') {
                TitleBtn.gotoAndStop(14);
            } else if (GameNameWithLvl == 'WhoAmI-Birds') {
                TitleBtn.gotoAndStop(15);
            } else if (GameNameWithLvl == 'WhoAmI-Birthday') {
                TitleBtn.gotoAndStop(16);
            } else if (GameNameWithLvl == 'WhoAmI-Clothes') {
                TitleBtn.gotoAndStop(17);
            } else if (GameNameWithLvl == 'WhoAmI-Colors') {
                TitleBtn.gotoAndStop(18);
            } else if (GameNameWithLvl == 'WhoAmI-DomesticAnimals') {
                TitleBtn.gotoAndStop(19);
            } else if (GameNameWithLvl == 'WhoAmI-Flowers') {
                TitleBtn.gotoAndStop(20);
            } else if (GameNameWithLvl == 'WhoAmI-Fruits') {
                TitleBtn.gotoAndStop(21);
            } else if (GameNameWithLvl == 'WhoAmI-HouseHoldThings') {
                TitleBtn.gotoAndStop(22);
            } else if (GameNameWithLvl == 'WhoAmI-Insects') {
                TitleBtn.gotoAndStop(23);
            } else if (GameNameWithLvl == 'WhoAmI-Shapes') {
                TitleBtn.gotoAndStop(24);
            } else if (GameNameWithLvl == 'WhoAmI-Transport') {
                TitleBtn.gotoAndStop(25);
            } else if (GameNameWithLvl == 'WhoAmI-Vegetables') {
                TitleBtn.gotoAndStop(26);
            } else if (GameNameWithLvl == 'WhoAmI-WildAnimals') {
                TitleBtn.gotoAndStop(27);
            }
            break;
        case 'WhoIsNotThere':
            TitleBtn.gotoAndStop(28);
            break;
        case 'WordShapes':
            TitleBtn.gotoAndStop(29);
            break;
        case 'WordSpell':
            TitleBtn.gotoAndStop(30);
            break;
        case 'WordStem':
            TitleBtn.gotoAndStop(31);
            break;
        case 'WordWalls':
            TitleBtn.gotoAndStop(32);
            break;
        case 'WordWipe':
            TitleBtn.gotoAndStop(33);
            break;

        //////////////////////////////////////////////////////////////////////////////////////////new games/////////////////////////////////////////////////////////////

        case 'Alternative':
            TitleBtn.gotoAndStop(35);
            break;
        case 'AreWeSame':
            TitleBtn.gotoAndStop(34);
            break;
        case 'AscendingOrder':
            TitleBtn.gotoAndStop(36);
            break;


        case 'BallPosition':
            TitleBtn.gotoAndStop(37);
            break;


        case 'Calendar':
            TitleBtn.gotoAndStop(38);
            break;
        case 'CarNumber':
            TitleBtn.gotoAndStop(39);
            break;
        case 'ChoosingShapes':
            TitleBtn.gotoAndStop(40);
            break;
        case 'CompleteMe':
            TitleBtn.gotoAndStop(41);
            break;
        case 'CrossWords':
            TitleBtn.gotoAndStop(42);
            break;


        case 'DiscoverMe':
            TitleBtn.gotoAndStop(43);
            break;
        case 'DropMe':
            TitleBtn.gotoAndStop(44);
            break;


        case 'FindTheCar':
            TitleBtn.gotoAndStop(45);
            break;
        case 'FindTheEdges':
            TitleBtn.gotoAndStop(46);
            break;
        case 'FindTheFaces':
            TitleBtn.gotoAndStop(47);
            break;


        case 'LineSegment':
            TitleBtn.gotoAndStop(48);
            break;


        case 'MatchTheCount':
            TitleBtn.gotoAndStop(49);
            break;
        case 'MoreOrLess':
            TitleBtn.gotoAndStop(50);
            break;


        case 'NumberMe':
            TitleBtn.gotoAndStop(51);
            break;


        case 'OddGroup':
            TitleBtn.gotoAndStop(52);
            break;
        case 'OddObject':
            TitleBtn.gotoAndStop(53);
            break;
        case 'OddOneOut':
            TitleBtn.gotoAndStop(54);
            break;


        case 'PlayTheDrums':
            TitleBtn.gotoAndStop(55);
            break;


        case 'RhymingWords':
            TitleBtn.gotoAndStop(56);
            break;


        case 'SensoryWords':
            TitleBtn.gotoAndStop(57);
            break;
        case 'ShadowMatch':
            TitleBtn.gotoAndStop(58);
            break;
        case 'ShadowWar':
            TitleBtn.gotoAndStop(59);
            break;
        case 'ShapeBreak':
            TitleBtn.gotoAndStop(60);
            break;
        case 'Sorting':
            TitleBtn.gotoAndStop(61);
            break;

        case 'WhatsMyColor':
            TitleBtn.gotoAndStop(62);
            break;

        case 'WhereIBelong':
            if (GameNameWithLvl == 'WhereIBelong-Transport') {
                TitleBtn.gotoAndStop(64);
            } else {
                TitleBtn.gotoAndStop(63);
            }
            break;

        case 'WhereItBelongs':
            TitleBtn.gotoAndStop(65);
            break;



        default:
            TitleBtn.gotoAndStop(0);
            break;
    }
}