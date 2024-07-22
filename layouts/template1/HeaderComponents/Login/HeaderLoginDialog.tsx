import { Modal, Drawer } from "antd";
import type { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import type { ModalProps } from "antd/es/modal";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import { Icon } from "@iconify/react";
import { memo } from "react";
// 登入背景
import HeaderLoginBg from "./LoginForm/HeaderLoginBg";
// 登入輸入框
import HeaderLoginInput from "./LoginForm/HeaderLoginInput";
// 登入樣式
import styles from "./HeaderLogin.module.scss";

const LoginDialog = memo(({ showLogin, setShowLogin }: { showLogin: boolean; setShowLogin: Function }) => {
    console.log("login dialog");
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    const drawerStyles: DrawerStyles = {
        header: {
            borderBottom: `0 solid`,
            padding: `0`,
        },
        body: {
            padding: `0`,
        },
    };
    const modalStyles: ModalProps["styles"] = {
        header: {
            padding: `0`,
        },
        body: {
            padding: `0`,
        },
        content: {
            padding: `0`,
        },
    };

    function DesktopTmp() {
        return (
            <Modal
                title={<div></div>}
                centered
                closable={false}
                open={showLogin}
                styles={modalStyles}
                onOk={() => setShowLogin(false)}
                onCancel={() => setShowLogin(false)}
            >
                <HeaderLoginBg
                    showLogin={showLogin}
                    setShowLogin={setShowLogin}
                    render={() => (
                        <div>
                            <h2 className="font-semibold OpenSansFont">CityBanana</h2>
                            <h5>在城市中追求美好時刻</h5>
                        </div>
                    )}
                />
                <HeaderLoginInput />
            </Modal>
        );
    }

    function MobileTmp() {
        return (
            <Drawer
                title={<div></div>}
                onClose={() => setShowLogin(false)}
                open={showLogin}
                width={"100%"}
                key="showDrawer"
                placement="left"
                closable={false}
                extra={<div></div>}
                styles={drawerStyles}
                className={styles["ant-drawer-header"]}
            >
                <HeaderLoginBg
                    showLogin={showLogin}
                    setShowLogin={setShowLogin}
                    render={() => (
                        <div>
                            <h2 className="font-semibold OpenSansFont">CityBanana</h2>
                            <h5>在城市中追求美好時刻</h5>
                        </div>
                    )}
                />
                <div className={styles["ant-drawer-header"]}>is work</div>
            </Drawer>
        );
    }

    if (isMobile) {
        return <MobileTmp />;
    }
    return <DesktopTmp />;
});

export default LoginDialog;
